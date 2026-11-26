'use client';
import { useEffect } from 'react';
import { TOOLS, runPure } from '@/lib/agent-tools';

// WebMCP (experimental, Chrome): exposes site actions to in-browser AI agents.
export default function WebMcp() {
  useEffect(() => {
    const mc = typeof navigator !== 'undefined' ? navigator.modelContext : null;
    if (!mc || typeof mc.registerTool !== 'function') return;
    const out = (obj) => ({ content: [{ type: 'text', text: JSON.stringify(obj) }] });
    const registered = [];
    for (const t of TOOLS) {
      try {
        mc.registerTool({
          name: t.name, description: t.description, inputSchema: t.inputSchema,
          execute: async (args = {}) => {
            const pure = runPure(t.name, args);
            if (pure) return out(pure);
            const res = await fetch('/api/lead/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...args, source: 'agent' }) });
            const data = await res.json().catch(() => ({ ok: false }));
            if (res.ok && window.gtag) window.gtag('event', 'generate_lead', { form: 'webmcp_' + t.name });
            return out(data);
          },
        });
        registered.push(t.name);
      } catch (e) { /* tool already registered or API changed */ }
    }
    return () => { try { registered.forEach((n) => mc.unregisterTool && mc.unregisterTool(n)); } catch (e) {} };
  }, []);
  return null;
}
