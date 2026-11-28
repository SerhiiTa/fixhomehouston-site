// WRA CRM inbound integration (server-side only). No imports on purpose: easy to unit test with a mocked fetch.
// Secrets come from env and are never logged or exposed to the browser.

const LIM = { formId: 120, eventId: 255, occurredAt: 64, name: 255, phone: 40, zip: 32, problem: 2000, body: 10000, domain: 255, utmSM: 160, utmCTT: 240, payloadBytes: 32000 };
const cut = (v, n) => String(v ?? '').slice(0, n);

export function crmEnabled(env = process.env) {
  return String(env.WRA_CRM_ENABLED || '').trim().toLowerCase() === 'true'
    && !!(env.WRA_CRM_INBOUND_URL || '').trim()
    && !!(env.WRA_FIXHOME_SOURCE_PUBLIC_KEY || '').trim()
    && !!(env.WRA_FIXHOME_SOURCE_SECRET || '').trim();
}

export function newSubmissionId() {
  return globalThis.crypto.randomUUID();
}

// lead: { id, source:'website_form'|'ai_agent', name, digits, phoneDisplay, zip, problem, appliance, notes, agentContext,
//         serviceArea, outside, far, consent:{via,text_version,timestamp}, utm:{source,medium,campaign,term,content,gclid}, occurredAt }
export function buildCrmPayload(lead) {
  const agent = lead.source === 'ai_agent';
  const utm = lead.utm || {};
  // The CRM intake card shows only customer/phone/problem/address, so the source website is put in front of the problem text.
  const problem = cut('[FixHomeHouston] ' + (lead.appliance ? `${lead.appliance}${lead.problem ? ': ' + lead.problem : ''}` : lead.problem), LIM.problem);
  const ctx = lead.agentContext ? cut(lead.agentContext, 500) : '';
  const notes = lead.notes ? cut(lead.notes, 1000) : '';
  const bodyLines = [
    lead.outside ? '*** OUT OF AREA: ZIP is outside our usual service area. Call to clarify. ***' : '',
    !lead.outside && lead.far ? '*** EXTENDED DISTANCE: confirm travel and timing. ***' : '',
    'Website: fixhomehouston.com (Houston Home Fix)',
    notes ? `Customer notes: ${notes}` : '',
    ctx ? `AI Agent Context: ${ctx}` : '',
    lead.outside ? 'ZIP state: not verified (outside service area; ignore any default state in the address)' : '',
    `Service area: ${lead.serviceArea || 'n/a'}`,
    `Out of area: ${lead.outside ? 'Yes' : 'No'}`,
    `Extended distance: ${lead.far ? 'Yes' : 'No'}`,
    `Contact consent: ${lead.consent && lead.consent.calls_and_service_sms ? 'Yes' : 'No'}`,
  ].filter(Boolean);

  const formFields = {
    source: { label: 'Submission source', value: lead.source },
    phone_display: { label: 'Phone as entered', value: cut(lead.phoneDisplay, LIM.phone) },
    service_area: { label: 'Service area', value: lead.serviceArea || null },
    out_of_area: { label: 'Out of area', value: !!lead.outside },
    far: { label: 'Extended distance', value: !!lead.far },
    notes: { label: 'Customer notes', value: notes },
    consent: { label: 'Contact consent evidence', value: { calls_and_service_sms: !!(lead.consent && lead.consent.calls_and_service_sms), text_version: lead.consent?.text_version || '', timestamp: lead.consent?.timestamp || '', via: lead.consent?.via || (agent ? 'ai_agent' : 'web_form') } },
    gclid: { label: 'Google Click ID', value: cut(utm.gclid, 240) },
  };
  if (ctx) formFields.agent_context = { label: 'AI Agent Context', value: ctx };

  return {
    formId: lead.source,
    providerEventId: `fixhomehouston:submission:${lead.id}`,
    occurredAt: lead.occurredAt,
    customer: { name: cut(lead.name, LIM.name), phone: `+1${lead.digits}` },
    // State is only known for ZIPs we serve (all Texas). For out-of-area ZIPs it is unknown, so it is omitted rather than guessed.
    serviceAddress: { postalCode: cut(lead.zip, LIM.zip), ...(lead.outside ? {} : { state: 'TX' }), country: 'US' },
    requestedService: { problemDescription: problem },
    message: { body: cut(bodyLines.join('\n'), LIM.body) },
    attribution: {
      websiteDomain: 'fixhomehouston.com',
      utm: { source: cut(utm.source, LIM.utmSM), medium: cut(utm.medium, LIM.utmSM), campaign: cut(utm.campaign, LIM.utmCTT), term: cut(utm.term, LIM.utmCTT), ...(utm.content ? { content: cut(utm.content, LIM.utmCTT) } : {}) },
    },
    formFields,
  };
}

// Website-side validation before anything is sent. Returns an array of problems (empty = ok).
export function validateCrmPayload(p) {
  const e = [];
  if (!['website_form', 'ai_agent'].includes(p.formId)) e.push('formId');
  if (!/^fixhomehouston:submission:[0-9a-f-]{36}$/i.test(p.providerEventId || '')) e.push('providerEventId');
  if (!p.occurredAt || Number.isNaN(Date.parse(p.occurredAt)) || !/(Z|[+-]\d\d:\d\d)$/.test(p.occurredAt)) e.push('occurredAt');
  if (!p.customer?.name) e.push('customer.name');
  if (!/^\+1[2-9]\d{2}[2-9]\d{6}$/.test(p.customer?.phone || '')) e.push('customer.phone');
  if (!/^\d{5}$/.test(p.serviceAddress?.postalCode || '')) e.push('serviceAddress.postalCode');
  if (!p.requestedService?.problemDescription) e.push('problemDescription');
  const ff = p.formFields || {};
  if (typeof ff.out_of_area?.value !== 'boolean' || typeof ff.far?.value !== 'boolean') e.push('service-area flags');
  const c = ff.consent?.value;
  if (!c || typeof c.calls_and_service_sms !== 'boolean' || !c.text_version || !c.timestamp) e.push('consent');
  if (new TextEncoder().encode(JSON.stringify(p)).length > LIM.payloadBytes) e.push('payload too large');
  return e;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Bounded retries (transient network errors, timeouts, 5xx) with exponential backoff + jitter; same payload and event id every time.
// Never throws. Returns { ok, status, duplicate, attempts, reason }.
export async function sendToCrm(payload, { env = process.env, fetchImpl = globalThis.fetch, sleep = wait, maxAttempts = 3, attemptTimeoutMs = 3500, budgetMs = 8000, random = Math.random, now = Date.now } = {}) {
  const problems = validateCrmPayload(payload);
  if (problems.length) return { ok: false, status: 0, attempts: 0, reason: 'validation: ' + problems.join(',') };
  const url = (env.WRA_CRM_INBOUND_URL || '').trim();
  const auth = `WRA-Source ${(env.WRA_FIXHOME_SOURCE_PUBLIC_KEY || '').trim()}:${(env.WRA_FIXHOME_SOURCE_SECRET || '').trim()}`;
  const body = JSON.stringify(payload);
  const started = now();
  let last = { ok: false, status: 0, attempts: 0, reason: 'not_attempted' };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const remaining = budgetMs - (now() - started);
    if (remaining <= 250) break;
    let retryAfterMs = 0, transient = false;
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), Math.min(attemptTimeoutMs, remaining));
    try {
      const res = await fetchImpl(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: auth }, body, signal: ctl.signal });
      let data = null;
      try { data = await res.json(); } catch { /* non-JSON infrastructure error */ }
      last = { ok: false, status: res.status, attempts: attempt, reason: `http_${res.status}` };
      if ((res.status === 200 || res.status === 201) && data && data.persisted === true) return { ok: true, status: res.status, duplicate: !!data.duplicate, attempts: attempt };
      if (res.status >= 500) {
        transient = true;
        const ra = Number(res.headers?.get?.('retry-after'));
        if (Number.isFinite(ra) && ra > 0) retryAfterMs = ra * 1000;
      }
    } catch (err) {
      transient = true;
      last = { ok: false, status: 0, attempts: attempt, reason: err && err.name === 'AbortError' ? 'timeout' : 'network_error' };
    } finally { clearTimeout(timer); }
    if (!transient) break; // permanent 4xx or unexpected success shape: do not retry
    if (attempt === maxAttempts) break;
    const backoff = Math.min(2000, 300 * 2 ** (attempt - 1)) + Math.floor(random() * 250);
    const delay = Math.max(backoff, retryAfterMs);
    if (budgetMs - (now() - started) <= delay + 250) break;
    await sleep(delay);
  }
  return last;
}
