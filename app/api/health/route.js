export const dynamic = 'force-dynamic';

const hits = [];

// Shows only booleans and the deployed commit, never secret values.
// ?telegram=1 asks Telegram to check the token and send one test message (max 5 per hour).
export async function GET(request) {
  const out = {
    ok: true,
    version: (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
    env: process.env.VERCEL_ENV || 'local',
    telegram_token_set: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    telegram_chat_id_set: Boolean(process.env.TELEGRAM_CHAT_ID),
    anthropic_key_set: Boolean(process.env.ANTHROPIC_API_KEY),
    crm_url_set: Boolean((process.env.WRA_CRM_INBOUND_URL || '').trim()),
    crm_url_is_https: /^https:\/\//.test((process.env.WRA_CRM_INBOUND_URL || '').trim()),
    crm_public_key_set: Boolean((process.env.WRA_FIXHOME_SOURCE_PUBLIC_KEY || '').trim()),
    crm_secret_set: Boolean((process.env.WRA_FIXHOME_SOURCE_SECRET || '').trim()),
    crm_enabled_flag: String(process.env.WRA_CRM_ENABLED || '').trim().toLowerCase() === 'true',
  };
  if (new URL(request.url).searchParams.get('telegram')) {
    const now = Date.now();
    while (hits.length && now - hits[0] > 3600e3) hits.shift();
    if (hits.length >= 5) return Response.json({ ...out, telegram_test: 'rate_limited' }, { status: 429 });
    hits.push(now);
    const raw = process.env.TELEGRAM_BOT_TOKEN || '', chatRaw = process.env.TELEGRAM_CHAT_ID || '';
    const token = raw.trim(), chat = chatRaw.trim();
    out.token_has_whitespace = raw !== token;
    const colon = token.indexOf(':');
    out.token_shape = {
      length: token.length,
      has_colon: colon >= 0,
      digits_before_colon: colon >= 0 ? (token.slice(0, colon).match(/\d/g) || []).length : null,
      non_digits_before_colon: colon >= 0 ? token.slice(0, colon).replace(/\d/g, '').length : null,
      chars_after_colon: colon >= 0 ? token.length - colon - 1 : null,
      starts_with_bot: /^bot/i.test(token),
      has_quotes: /["'`]/.test(token),
      has_inner_whitespace: /\s/.test(token),
      other_odd_chars: [...new Set((token.match(/[^A-Za-z0-9_:-]/g) || []))].filter((c) => !/\s/.test(c)).join(' ') || null,
    };
    out.token_looks_valid = /^\d+:[A-Za-z0-9_-]{30,}$/.test(token);
    out.chat_id_looks_valid = /^-?\d+$/.test(chat);
    try {
      const me = await (await fetch(`https://api.telegram.org/bot${token}/getMe`)).json();
      out.getMe_ok = Boolean(me.ok);
      out.bot_username = me.ok ? me.result.username : undefined;
      out.getMe_error = me.ok ? undefined : me.description;
      if (me.ok) {
        const s = await (await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chat, text: 'Test message from fixhomehouston.com: Telegram is connected.' }),
        })).json();
        out.send_ok = Boolean(s.ok);
        out.send_error = s.ok ? undefined : s.description;
      }
    } catch (e) { out.network_error = String(e.message || e).slice(0, 120); }
  }
  return Response.json(out, { headers: { 'Cache-Control': 'no-store' } });
}
