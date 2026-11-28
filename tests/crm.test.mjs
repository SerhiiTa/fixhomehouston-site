import assert from 'node:assert/strict';
import { buildCrmPayload, validateCrmPayload, sendToCrm, crmEnabled } from '../lib/crm.js';
import { submitLead } from '../lib/lead.js';

let n = 0; const ok = (name, fn) => fn().then(() => { n++; console.log('PASS', name); }).catch((e) => { console.log('FAIL', name, '\n', e.message); process.exitCode = 1; });
const ENV = { WRA_CRM_ENABLED: 'true', WRA_CRM_INBOUND_URL: 'https://crm.test/in', WRA_FIXHOME_SOURCE_PUBLIC_KEY: 'pub', WRA_FIXHOME_SOURCE_SECRET: 'sec', TELEGRAM_BOT_TOKEN: 'x', TELEGRAM_CHAT_ID: '1' };
const base = { id: '6e8db615-8918-421e-b438-418b6cd77d75', source: 'ai_agent', name: 'Example Customer', digits: '2025550101', phoneDisplay: '(202) 555-0101', zip: '77450', problem: 'not cooling', appliance: 'LG refrigerator', notes: 'Refrigerator is not cooling.', agentContext: 'ZIP verified.', serviceArea: 'Katy', outside: false, far: false, occurredAt: '2026-11-27T22:00:00.000Z', consent: { calls_and_service_sms: true, text_version: 'v1-2026-11-26', timestamp: '2026-11-27T22:00:00.000Z', via: 'ai_agent' }, utm: { source: 'google', medium: 'organic', gclid: '' } };
const res = (status, json, headers = {}) => ({ status, headers: { get: (k) => headers[k.toLowerCase()] }, json: async () => { if (json === undefined) throw new Error('not json'); return json; } });
const good = { ok: true, persisted: true, duplicate: false };
const fast = { sleep: async () => {}, random: () => 0 };
let calls;

await ok('feature flag off by default / needs all vars', async () => {
  assert.equal(crmEnabled({}), false);
  assert.equal(crmEnabled({ ...ENV, WRA_CRM_ENABLED: 'false' }), false);
  assert.equal(crmEnabled({ ...ENV, WRA_FIXHOME_SOURCE_SECRET: '' }), false);
  assert.equal(crmEnabled(ENV), true);
});
await ok('payload matches the WRA contract (agent)', async () => {
  const p = buildCrmPayload(base);
  assert.equal(p.formId, 'ai_agent'); assert.equal(p.providerEventId, 'fixhomehouston:submission:' + base.id);
  assert.equal(p.customer.phone, '+12025550101'); assert.deepEqual(p.serviceAddress, { postalCode: '77450', state: 'TX', country: 'US' });
  assert.equal(p.requestedService.problemDescription, 'LG refrigerator: not cooling');
  assert.match(p.message.body, /AI Agent Context: ZIP verified\./); assert.match(p.message.body, /Out of area: No/); assert.match(p.message.body, /Contact consent: Yes/);
  assert.equal(p.attribution.websiteDomain, 'fixhomehouston.com'); assert.equal(p.formFields.agent_context.value, 'ZIP verified.');
  assert.equal(p.formFields.consent.value.via, 'ai_agent'); assert.equal(p.formFields.out_of_area.value, false); assert.equal('requestedAppointment' in p, false);
  assert.deepEqual(validateCrmPayload(p), []);
});
await ok('web form: no agent_context, formId website_form', async () => {
  const p = buildCrmPayload({ ...base, source: 'website_form', agentContext: '', consent: { ...base.consent, via: 'web_form' } });
  assert.equal(p.formId, 'website_form'); assert.equal('agent_context' in p.formFields, false); assert.doesNotMatch(p.message.body, /AI Agent Context/);
});
await ok('out-of-area flagged prominently, still valid', async () => {
  const p = buildCrmPayload({ ...base, outside: true, serviceArea: null });
  assert.match(p.message.body.split('\n')[0], /OUT OF AREA/); assert.equal(p.formFields.service_area.value, null); assert.equal(p.formFields.out_of_area.value, true); assert.deepEqual(validateCrmPayload(p), []);
});
await ok('validation rejects bad phone/zip/consent/timestamp', async () => {
  const p = buildCrmPayload(base);
  assert.ok(validateCrmPayload({ ...p, customer: { ...p.customer, phone: '+11235550101' } }).includes('customer.phone'));
  assert.ok(validateCrmPayload({ ...p, serviceAddress: { ...p.serviceAddress, postalCode: '7745' } }).includes('serviceAddress.postalCode'));
  assert.ok(validateCrmPayload({ ...p, occurredAt: '2026-11-27 22:00' }).includes('occurredAt'));
  assert.ok(validateCrmPayload({ ...p, formFields: { ...p.formFields, consent: { label: 'x', value: { calls_and_service_sms: 'yes' } } } }).includes('consent'));
});
await ok('false consent is preserved, not fabricated', async () => {
  const p = buildCrmPayload({ ...base, consent: { ...base.consent, calls_and_service_sms: false } });
  assert.equal(p.formFields.consent.value.calls_and_service_sms, false); assert.match(p.message.body, /Contact consent: No/);
});
await ok('success 201 sends auth header and JSON', async () => {
  calls = [];
  const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async (u, o) => { calls.push({ u, o }); return res(201, good); } });
  assert.equal(r.ok, true); assert.equal(calls.length, 1); assert.equal(calls[0].o.headers.Authorization, 'WRA-Source pub:sec'); assert.equal(calls[0].u, 'https://crm.test/in');
});
await ok('duplicate (200) counts as success', async () => {
  const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async () => res(200, { ...good, duplicate: true }) });
  assert.equal(r.ok, true); assert.equal(r.duplicate, true);
});
await ok('5xx retried with SAME payload/event id, then succeeds', async () => {
  calls = []; let i = 0;
  const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async (u, o) => { calls.push(o.body); return i++ < 2 ? res(503, { ok: false }) : res(201, good); } });
  assert.equal(r.ok, true); assert.equal(r.attempts, 3); assert.equal(new Set(calls).size, 1);
});
await ok('network error retried; gives up after max attempts', async () => {
  calls = [];
  const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async () => { calls.push(1); throw new Error('boom'); } });
  assert.equal(r.ok, false); assert.equal(calls.length, 3); assert.equal(r.reason, 'network_error');
});
await ok('permanent 4xx NOT retried (400/401/413/422)', async () => {
  for (const s of [400, 401, 413, 422]) { calls = []; const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async () => { calls.push(1); return res(s, { ok: false }); } }); assert.equal(calls.length, 1, 'status ' + s); assert.equal(r.ok, false); }
});
await ok('non-JSON 502 handled and retried', async () => {
  calls = []; const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async () => { calls.push(1); return res(502, undefined); } });
  assert.equal(calls.length, 3); assert.equal(r.ok, false);
});
await ok('Retry-After is honored', async () => {
  const delays = []; let i = 0;
  await sendToCrm(buildCrmPayload(base), { env: ENV, random: () => 0, sleep: async (d) => delays.push(d), fetchImpl: async () => (i++ === 0 ? res(503, {}, { 'retry-after': '2' }) : res(201, good)) });
  assert.ok(delays[0] >= 2000);
});
await ok('200 without persisted:true is NOT success', async () => {
  const r = await sendToCrm(buildCrmPayload(base), { env: ENV, ...fast, fetchImpl: async () => res(200, { ok: true }) });
  assert.equal(r.ok, false);
});
await ok('invalid payload never sent', async () => {
  calls = []; const r = await sendToCrm({ ...buildCrmPayload(base), serviceAddress: { postalCode: '1' } }, { env: ENV, fetchImpl: async () => { calls.push(1); return res(201, good); } });
  assert.equal(r.ok, false); assert.equal(calls.length, 0);
});

// ---- full submitLead flow with injected Telegram + CRM ----
const form = { name: 'Test', phone: '(346) 381-8094', zip: '77450', problem: 'Fridge', website: '', utm: { source: 'google', medium: 'cpc', gclid: 'abc' } };
let ipn = 0; const ip = () => 'ip' + ++ipn;
await ok('CRM disabled (default): behaves as before, CRM never called', async () => {
  let crmCalls = 0; const r = await submitLead(form, { ip: ip(), deps: { env: { TELEGRAM_BOT_TOKEN: 'x', TELEGRAM_CHAT_ID: '1' }, telegram: async () => true, crm: async () => { crmCalls++; return { ok: true }; } } });
  assert.equal(r.status, 200); assert.equal(crmCalls, 0);
});
await ok('Telegram ok + CRM ok: success, payload carries utm/gclid + zip', async () => {
  let sent; const r = await submitLead(form, { ip: ip(), deps: { env: ENV, telegram: async () => true, crm: async (p) => { sent = p; return { ok: true, attempts: 1 }; } } });
  assert.equal(r.status, 200); assert.equal(sent.formId, 'website_form'); assert.equal(sent.attribution.utm.source, 'google'); assert.equal(sent.formFields.gclid.value, 'abc'); assert.equal(sent.serviceAddress.postalCode, '77450');
  assert.equal(sent.formFields.consent.value.via, 'web_form');
});
await ok('CRM fails but Telegram ok: customer still sees success + owner gets a CRM-failed note', async () => {
  const tg = []; const r = await submitLead(form, { ip: ip(), deps: { env: ENV, telegram: async (t, c, text) => { tg.push(text); return true; }, crm: async () => ({ ok: false, reason: 'http_503', attempts: 3 }) } });
  assert.equal(r.status, 200); await new Promise((x) => setTimeout(x, 10)); assert.equal(tg.length, 2); assert.match(tg[1], /CRM sync FAILED/); assert.doesNotMatch(tg[1], /381-8094/);
});
await ok('Telegram fails but CRM ok: still success (lead is saved)', async () => {
  const r = await submitLead(form, { ip: ip(), deps: { env: ENV, telegram: async () => false, crm: async () => ({ ok: true }) } });
  assert.equal(r.status, 200);
});
await ok('both fail: error to the customer', async () => {
  const r = await submitLead(form, { ip: ip(), deps: { env: ENV, telegram: async () => false, crm: async () => ({ ok: false, reason: 'x' }) } });
  assert.equal(r.status, 502);
});
await ok('CRM throwing does not break Telegram success', async () => {
  const r = await submitLead(form, { ip: ip(), deps: { env: ENV, telegram: async () => true, crm: async () => { throw new Error('x'); } } });
  assert.equal(r.status, 200);
});
await ok('one submission id per submit, CRM called once (no duplicate on Telegram path)', async () => {
  const ids = []; let tgCalls = 0;
  await submitLead(form, { ip: ip(), deps: { env: ENV, telegram: async () => { tgCalls++; return true; }, crm: async (p) => { ids.push(p.providerEventId); return { ok: true }; } } });
  assert.equal(ids.length, 1); assert.equal(tgCalls, 1); assert.match(ids[0], /^fixhomehouston:submission:[0-9a-f-]{36}$/);
});
await ok('out-of-area form lead is sent to CRM with the flag', async () => {
  let sent; const r = await submitLead({ ...form, zip: '90210' }, { ip: ip(), deps: { env: ENV, telegram: async () => true, crm: async (p) => { sent = p; return { ok: true }; } } });
  assert.equal(r.status, 200); assert.equal(r.body.outside, true); assert.equal(sent.formFields.out_of_area.value, true);
});
await ok('agent: needs notice ack + served ZIP; context goes to CRM', async () => {
  const a = { ...form, source: undefined, appliance: 'LG fridge', agent_context: 'Quoted diagnostic fee.', contact_notice_acknowledged: true };
  assert.equal((await submitLead({ ...a, contact_notice_acknowledged: false }, { ip: ip(), source: 'agent', deps: { env: ENV, telegram: async () => true, crm: async () => ({ ok: true }) } })).status, 400);
  assert.equal((await submitLead({ ...a, zip: '90210' }, { ip: ip(), source: 'agent', deps: { env: ENV, telegram: async () => true, crm: async () => ({ ok: true }) } })).status, 422);
  let sent; const r = await submitLead(a, { ip: ip(), source: 'agent', deps: { env: ENV, telegram: async () => true, crm: async (p) => { sent = p; return { ok: true }; } } });
  assert.equal(r.status, 200); assert.equal(sent.formId, 'ai_agent'); assert.equal(sent.formFields.agent_context.value, 'Quoted diagnostic fee.'); assert.equal(sent.formFields.consent.value.text_version, 'v1-2026-11-26');
});
console.log(`\n${n} passed`);
