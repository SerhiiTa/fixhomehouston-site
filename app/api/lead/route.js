import { submitLead } from '@/lib/lead';

export const dynamic = 'force-dynamic';
export const maxDuration = 20;

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false }, { status: 400 }); }
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const r = await submitLead(body, { ip, source: body.source === 'agent' ? 'agent' : 'form' });
  return Response.json(r.body, { status: r.status });
}
