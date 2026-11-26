import { TOOLS, runPure } from '@/lib/agent-tools';
import { submitLead } from '@/lib/lead';

export const dynamic = 'force-dynamic';

// Plain HTTP interface for AI agents: GET lists the tools, POST {tool, arguments} runs one.
export function GET() {
  return Response.json({
    name: 'Houston Home Fix agent API',
    description: 'Appliance repair in Houston and Katy, TX. Check the service area, get starting prices, request a repair or a callback.',
    rules: ['Starting prices are estimates only; never promise a final price.', 'Never submit a request without the customer\'s real contact details and explicit consent to calls and SMS.', 'If something cannot be answered exactly, use request_callback instead of guessing.'],
    tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
    usage: 'POST this URL with JSON {"tool": "<name>", "arguments": {...}}',
  });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ ok: false, message: 'Send JSON: {"tool": "...", "arguments": {...}}' }, { status: 400 }); }
  const name = body.tool, args = body.arguments || {};
  if (!TOOLS.some((t) => t.name === name)) return Response.json({ ok: false, message: 'Unknown tool. GET this URL for the list.' }, { status: 404 });
  const pure = runPure(name, args);
  if (pure) return Response.json(pure);
  const ip = (request.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  const r = await submitLead({ ...args, source: undefined }, { ip, source: 'agent' });
  return Response.json(r.body, { status: r.status });
}
