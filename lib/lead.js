import { areaInfo } from '@/lib/agent-tools';

const clean = (v, n = 400) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);
const hits = new Map(); // simple per-instance rate limit

function limited(ip) {
  const now = Date.now(), win = 60 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 8;
}

// Returns { status, body }. source: 'form' | 'agent'
export async function submitLead(body, { ip = 'unknown', source = 'form' } = {}) {
  if (clean(body.website)) return { status: 200, body: { ok: true } }; // honeypot
  if (limited(ip)) return { status: 429, body: { ok: false, message: 'Too many requests. Please call (346) 489-6281.' } };
  const name = clean(body.name, 100), phone = clean(body.phone, 40);
  const problem = clean(body.problem || body.question, 300);
  if (!name || phone.replace(/\D/g, '').length < 10 || !problem) return { status: 400, body: { ok: false, message: 'Name, a valid 10-digit phone and the problem or question are required.' } };

  let zipLine = '';
  if (source === 'agent') {
    if (body.consent !== true) return { status: 400, body: { ok: false, message: 'Consent is required. Ask the customer to agree to calls and SMS from HomeFix Appliance Repair LLC, then retry with consent=true.' } };
    if (body.zip) {
      const a = areaInfo(body.zip);
      if (!a.served) return { status: 422, body: { ok: false, message: a.message } };
      zipLine = `ZIP: ${a.zip} (${a.area || 'core area'})${a.far ? ' - FAR, confirm travel' : ''}`;
    }
  }
  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return { status: 503, body: { ok: false, reason: 'not_configured', message: 'Could not send right now. Please call (346) 489-6281.' } };

  const text = [
    source === 'agent' ? 'New request via AI agent (fixhomehouston.com)' : 'New website request (fixhomehouston.com)',
    `Name: ${name}`, `Phone: ${phone}`,
    body.appliance ? `Appliance: ${clean(body.appliance, 120)}` : '',
    body.question ? `Question: ${problem}` : `Problem: ${problem}`,
    zipLine, body.area ? `Area: ${clean(body.area, 100)}` : '', body.notes ? `Notes: ${clean(body.notes, 500)}` : '',
    source === 'agent' ? 'Customer consent to calls/SMS: yes (given to the agent)' : '',
  ].filter(Boolean).join('\n');
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text }),
  });
  return { status: res.ok ? 200 : 502, body: res.ok ? { ok: true, message: 'Request received. The technician will call the customer shortly to confirm a time.' } : { ok: false, message: 'Could not send right now. Please call (346) 489-6281.' } };
}
