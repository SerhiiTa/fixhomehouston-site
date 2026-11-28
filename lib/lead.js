import { areaInfo } from '@/lib/agent-tools';
import { CONTACT_NOTICE, CONTACT_NOTICE_VERSION, FORM_CONSENT_VERSION } from '@/lib/site';
import { buildCrmPayload, crmEnabled, newSubmissionId, sendToCrm } from '@/lib/crm';

const clean = (v, n = 400) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const hits = new Map(); // simple per-instance rate limit

function limited(ip) {
  const now = Date.now(), win = 60 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 8;
}

async function sendTelegram(token, chat, text) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text }), signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch { return false; }
}

// Returns { status, body }. source: 'form' | 'agent'. Telegram and CRM deliveries are independent:
// the customer sees success if at least one of them accepted the lead.
export async function submitLead(body, { ip = 'unknown', source = 'form', deps = {} } = {}) {
  const { telegram = sendTelegram, crm = sendToCrm, env = process.env } = deps;
  if (clean(body.website)) return { status: 200, body: { ok: true } }; // honeypot
  if (limited(ip)) return { status: 429, body: { ok: false, message: 'Too many requests. Please call (346) 489-6281.' } };
  const name = clean(body.name, 100), phone = clean(body.phone, 40);
  const problem = clean(body.problem || body.question, 300);
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (!name || !problem) return { status: 400, body: { ok: false, message: 'Name and the problem or question are required.' } };
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return { status: 400, body: { ok: false, message: 'Please enter a valid US phone number, 10 digits.' } };
  const zipIn = clean(body.zip, 10);
  if (!/^\d{5}$/.test(zipIn)) return { status: 400, body: { ok: false, message: 'Please enter your 5-digit US ZIP code.' } };
  if (source === 'agent' && body.contact_notice_acknowledged !== true) return { status: 400, body: { ok: false, message: 'Tell the customer this notice first, then retry with contact_notice_acknowledged=true: ' + CONTACT_NOTICE } };

  const a = areaInfo(zipIn);
  if (a.reason === 'invalid_zip') return { status: 400, body: { ok: false, message: a.message } };
  let outside = false, far = false, serviceArea = null, zipLine = '';
  if (!a.served) {
    if (source === 'agent') return { status: 422, body: { ok: false, message: a.message } }; // agents can tell the customer right away
    outside = true; zipLine = `ZIP: ${a.zip} - OUTSIDE SERVICE AREA, call to clarify`;
  } else {
    far = !!a.far; serviceArea = a.area || null;
    zipLine = `ZIP: ${a.zip} (${a.area || 'core area'})${a.far ? ' - FAR, confirm travel' : ''}`;
  }

  const token = (env.TELEGRAM_BOT_TOKEN || '').trim(), chat = (env.TELEGRAM_CHAT_ID || '').trim();
  const tgConfigured = !!(token && chat);
  const useCrm = crmEnabled(env);
  if (!tgConfigured && !useCrm) return { status: 503, body: { ok: false, reason: 'not_configured', message: 'Could not send right now. Please call (346) 489-6281.' } };

  const submissionId = newSubmissionId();
  const occurredAt = new Date().toISOString();
  const appliance = clean(body.appliance, 120);
  const notes = clean(body.notes, 500);
  const agentContext = source === 'agent' ? clean(body.agent_context, 500) : '';
  const phoneDisplay = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

  const text = [
    source === 'agent' ? 'New request via AI agent (fixhomehouston.com)' : outside ? 'New website request - OUTSIDE AREA (fixhomehouston.com)' : 'New website request (fixhomehouston.com)',
    `Name: ${name}`, `Phone: ${phoneDisplay}`,
    appliance ? `Appliance: ${appliance}` : '',
    body.question ? `Question: ${problem}` : `Problem: ${problem}`,
    zipLine, notes ? `Notes: ${notes}` : '',
    agentContext ? `Agent context: ${agentContext}` : '',
    `Ref: ${submissionId.slice(0, 8)}`,
    source === 'agent' ? `Contact notice relayed by agent: yes (${CONTACT_NOTICE_VERSION}, ${occurredAt}). Calls and service SMS about this request only, no marketing.` : '',
  ].filter(Boolean).join('\n');

  const utmIn = body.utm && typeof body.utm === 'object' ? body.utm : {};
  const lead = {
    id: submissionId, source: source === 'agent' ? 'ai_agent' : 'website_form', name, digits, phoneDisplay, zip: zipIn,
    problem, appliance, notes, agentContext, serviceArea, outside, far, occurredAt,
    consent: { calls_and_service_sms: true, text_version: source === 'agent' ? CONTACT_NOTICE_VERSION : FORM_CONSENT_VERSION, timestamp: occurredAt, via: source === 'agent' ? 'ai_agent' : 'web_form' },
    utm: { source: clean(utmIn.source, 160), medium: clean(utmIn.medium, 160), campaign: clean(utmIn.campaign, 240), term: clean(utmIn.term, 240), content: clean(utmIn.content, 240), gclid: clean(utmIn.gclid, 240) },
  };

  // Independent deliveries, run in parallel; one failing never blocks the other.
  const [tgR, crmR] = await Promise.allSettled([
    tgConfigured ? telegram(token, chat, text) : Promise.resolve(false),
    useCrm ? crm(buildCrmPayload(lead), { env }) : Promise.resolve({ ok: false, skipped: true }),
  ]);
  const tgOk = tgR.status === 'fulfilled' && tgR.value === true;
  const crmRes = crmR.status === 'fulfilled' ? crmR.value : { ok: false, reason: 'exception' };

  // Log only non-sensitive facts (no PII, no secrets).
  if (useCrm) console.log(`[lead] ${submissionId} telegram=${tgOk ? 'ok' : 'fail'} crm=${crmRes.ok ? (crmRes.duplicate ? 'duplicate' : 'ok') : 'fail:' + (crmRes.reason || 'unknown')} attempts=${crmRes.attempts ?? 0}`);
  else if (!tgOk) console.error(`[lead] ${submissionId} telegram=fail`);

  // Safety net: if the CRM failed but Telegram worked, tell the owner (no customer data, just the reference).
  if (useCrm && !crmRes.ok && tgOk) {
    telegram(token, chat, `CRM sync FAILED for the lead above (ref ${submissionId}, reason: ${crmRes.reason || 'unknown'}). Add it to the CRM manually.`).catch(() => {});
  }

  if (!tgOk && !crmRes.ok) return { status: 502, body: { ok: false, message: 'Could not send right now. Please call (346) 489-6281.' } };
  return {
    status: 200,
    body: { ok: true, outside, message: outside ? 'Thank you. ZIP ' + zipIn + ' is outside our usual service area, so we will contact you to clarify whether we can help.' : source === 'agent' ? 'Request received. The technician will phone the customer to confirm a time. Notice for the customer: they may be called and sent service text messages about this request only, never marketing. Reply STOP to opt out.' : 'Request received. The technician will call the customer shortly to confirm a time.' },
  };
}
