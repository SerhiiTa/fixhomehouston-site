export const dynamic = 'force-dynamic';

const clean = (v, n = 400) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n);

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  if (clean(body.website)) return Response.json({ ok: true }); // honeypot: pretend success
  const name = clean(body.name, 100), phone = clean(body.phone, 40), problem = clean(body.problem, 300);
  if (!name || phone.replace(/\D/g, '').length < 10 || !problem) return Response.json({ ok: false }, { status: 400 });

  const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return Response.json({ ok: false, reason: 'not_configured' }, { status: 503 });

  const text = ['New website request (fixhomehouston.com)', `Name: ${name}`, `Phone: ${phone}`, `Problem: ${problem}`,
    body.area ? `Area: ${clean(body.area, 100)}` : '', body.notes ? `Notes: ${clean(body.notes, 500)}` : ''].filter(Boolean).join('\n');
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text }),
  });
  return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
}
