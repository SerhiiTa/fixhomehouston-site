// Generates synthetic QA payloads for the isolated WRA CRM environment. Sends NOTHING.
// Usage: node scripts/crm-qa.mjs ./qa-out
// Then run the printed curl commands yourself against the ISOLATED test environment only.
import { mkdirSync, writeFileSync } from 'node:fs';
import { buildCrmPayload, validateCrmPayload, newSubmissionId } from '../lib/crm.js';

const dir = process.argv[2] || './qa-out';
mkdirSync(dir, { recursive: true });
const now = () => new Date().toISOString();
const mk = (source, over = {}) => {
  const t = now();
  return buildCrmPayload({
    id: newSubmissionId(), source, name: 'QA Test Customer', digits: '2025550101', phoneDisplay: '(202) 555-0101', zip: '77450',
    problem: 'QA test: not cooling', appliance: 'QA test refrigerator', notes: 'QA test only. Safe to delete.',
    agentContext: source === 'ai_agent' ? 'QA test. ZIP verified. Customer informed about the diagnostic fee.' : '',
    serviceArea: 'Katy', outside: false, far: false, occurredAt: t,
    consent: { calls_and_service_sms: true, text_version: source === 'ai_agent' ? 'v1-2026-11-26' : 'web-form-v1-2026-11-27', timestamp: t, via: source === 'ai_agent' ? 'ai_agent' : 'web_form' },
    utm: { source: 'qa', medium: 'test', campaign: 'crm-qa', term: '', gclid: '' }, ...over,
  });
};
const cases = {
  '1-website-form': mk('website_form'),
  '2-ai-agent': mk('ai_agent'),
  '3-out-of-area': mk('website_form', { zip: '90210', serviceArea: null, outside: true, problem: 'QA test: out of area' }),
  '4-extended-distance': mk('website_form', { zip: '77478', serviceArea: 'Sugar Land', far: true, problem: 'QA test: extended distance' }),
};
for (const [name, p] of Object.entries(cases)) {
  const bad = validateCrmPayload(p);
  if (bad.length) throw new Error(`${name} invalid: ${bad.join(',')}`);
  writeFileSync(`${dir}/${name}.json`, JSON.stringify(p, null, 2));
  console.log(`wrote ${dir}/${name}.json  (${p.providerEventId})`);
}
console.log(`
Run against the ISOLATED test environment only (set the 3 variables from the isolated environment first):
  export WRA_CRM_INBOUND_URL=...  WRA_FIXHOME_SOURCE_PUBLIC_KEY=...  WRA_FIXHOME_SOURCE_SECRET=...
  for f in ${dir}/*.json; do echo "== $f"; curl --silent --show-error --write-out '\\nHTTP %{http_code}\\n' \\
    --request POST "$WRA_CRM_INBOUND_URL" --header "Content-Type: application/json" \\
    --header "Authorization: WRA-Source \${WRA_FIXHOME_SOURCE_PUBLIC_KEY}:\${WRA_FIXHOME_SOURCE_SECRET}" --data-binary @"$f"; done
Duplicate test: send ${dir}/1-website-form.json a second time. Expect HTTP 200 with duplicate:true.
Expected for the first four: HTTP 201, ok:true, persisted:true, duplicate:false.`);
