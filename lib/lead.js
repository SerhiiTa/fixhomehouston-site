import { areaInfo } from '@/lib/agent-tools';
import { CONTACT_NOTICE, CONTACT_NOTICE_VERSION } from '@/lib/site';

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
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1);
  if (!name || !problem) return { status: 400, body: { ok: false, message: 'Name and the problem or question are required.' } };
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(digits)) return { status: 400, body: { ok: false, message: 'Please enter a valid US phone number, 10 digits.' } };
  const zipIn = clean(body.zip, 10);
  if (source === 'form' && !/^\d{5}$/.test(zipIn)) return { status: 400, body: { ok: false, message: 'Please enter your 5-digit US ZIP code.' } };

  let zipLine = '';
  if (source === 'form') {
    const a = areaInfo(zipIn);
    if (!a.served) return { status: 422, body: { ok: false, message: a.message + ' Please call (346) 489-6281 if you think this is a mistake.' } };
    zipLine = `ZIP: ${a.zip} (${a.area || 'core area'})${a.far ? ' - FAR, confirm travel' : ''}`;
  }
  if (source === 'agent') {
    if (body.contact_notice_acknowledged !== true) return { status: 400, body: { ok: false, message: 'Tell the customer this notice first, then retry with contact_notice_acknowledged=true: ' + CONTACT_NOTICE } };
    if (body.zip) {
      const a = areaInfo(body.zip);
      if (!a.served) return { status: 422, body: { ok: false, message: a.message } };
      zipLine = `ZIP: ${a.zip} (${a.area || 'core area'})${a.far ? ' - FAR, confirm travel' : ''}`;
    }
  }
  const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim(), chat = (process.env.TELEGRAM_CHAT_ID || '').trim();
  if (!token || !chat) return { status: 503, body: { ok: false, reason: 'not_configured', message: 'Could not send right now. Please call (346) 489-6281.' } };

  const text = [
    source === 'agent' ? 'New request via AI agent (fixhomehouston.com)' : 'New website request (fixhomehouston.com)',
    `Name: ${name}`, `Phone: (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`,
    body.appliance ? `Appliance: ${clean(body.appliance, 120)}` : '',
    body.question ? `Question: ${problem}` : `Problem: ${problem}`,
    zipLine, body.area ? `Area: ${clean(body.area, 100)}` : '', body.notes ? `Notes: ${clean(body.notes, 500)}` : '',
    source === 'agent' ? `Contact notice relayed by agent: yes (${CONTACT_NOTICE_VERSION}, ${new Date().toISOString()}). Calls and service SMS about this request only, no marketing.` : '',
  ].filter(Boolean).join('\n');
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text }),
  });
  return { status: res.ok ? 200 : 502, body: res.ok ? { ok: true, message: source === 'agent' ? 'Request received. The technician will phone the customer to confirm a time. Notice for the customer: they may be called and sent service text messages about this request only, never marketing. Reply STOP to opt out.' : 'Request received. The technician will call the customer shortly to confirm a time.' } : { ok: false, message: 'Could not send right now. Please call (346) 489-6281.' } };
}
