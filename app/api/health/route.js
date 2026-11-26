export const dynamic = 'force-dynamic';

// Shows only booleans and the deployed commit, never secret values.
export function GET() {
  return Response.json({
    ok: true,
    version: (process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7),
    env: process.env.VERCEL_ENV || 'local',
    telegram_token_set: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    telegram_chat_id_set: Boolean(process.env.TELEGRAM_CHAT_ID),
    anthropic_key_set: Boolean(process.env.ANTHROPIC_API_KEY),
  }, { headers: { 'Cache-Control': 'no-store' } });
}
