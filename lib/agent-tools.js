import { PRICES, SITE, SERVICES } from '@/lib/site';
import { checkZip } from '@/lib/service-area';

const GROUPS = {
  cooling: ['fridge', 'refrigerator', 'freezer', 'ice maker', 'icemaker', 'wine cooler', 'wine', 'sub-zero', 'subzero', 'cooling'],
  laundry: ['washer', 'washing', 'dryer', 'laundry'],
  kitchen: ['oven', 'cooktop', 'range', 'stove', 'dishwasher', 'burner'],
};
export const APPLIANCES = ['refrigerator', 'freezer', 'ice maker', 'wine cooler', 'washer', 'dryer', 'dishwasher', 'oven', 'cooktop', 'range', 'stove'];

const STOP = new Set(['not', 'the', 'will', 'and', 'for', 'with', 'working', 'issues', 'is', 'my', 'does', 'doesn', 'wont']);
const words = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));

export function areaInfo(zip) {
  const r = checkZip(zip);
  if (r.status === 'invalid') return { served: false, reason: 'invalid_zip', message: 'Please provide a 5-digit US ZIP code.' };
  if (r.status === 'outside') return { served: false, zip: r.zip, message: `Sorry, ZIP ${r.zip} is outside our service area (Houston, Katy and nearby neighborhoods). We cannot service this address.` };
  return {
    served: true, zip: r.zip, far: r.far, area: r.area,
    message: r.far
      ? `Yes, we serve ZIP ${r.zip} (${r.area}). Because it is farther from our Houston base, the technician will confirm travel and timing by phone.`
      : `Yes, we serve ZIP ${r.zip}.`,
  };
}

export function estimatePrice({ appliance, problem } = {}) {
  const text = `${appliance || ''} ${problem || ''}`.toLowerCase();
  const group = Object.entries(GROUPS).find(([, keys]) => keys.some((k) => new RegExp('\\b' + k + '\\b').test(text)))?.[0];
  const base = { currency: 'USD', diagnostic: SITE.diagnostic, disclaimer: 'Starting estimates only. The final price depends on the model, the part and the repair, and is quoted by the technician before any work begins. Do not promise a final price to the customer.' };
  if (!group) return { ...base, known: false, message: 'We do not have a price table for that appliance. The technician can quote after a short call. Use request_callback.' };
  const g = PRICES.find((x) => x.title.toLowerCase() === group);
  const ws = words(problem);
  const scored = g.rows.map(([label, price]) => ({ label, price, score: words(label).filter((w) => ws.includes(w)).length })).sort((a, b) => b.score - a.score);
  const top = scored[0]?.score || 0;
  const best = scored.filter((r) => r.score > 0 && r.score === top);
  if (!best.length) return { ...base, known: false, category: g.title, message: 'We could not match this problem to a listed repair, so we cannot give a price. Do not guess. Use request_callback and the technician will call.', listed_repairs: g.rows.map(([label, price]) => ({ problem: label, starting_at: price })) };
  return { ...base, known: true, category: g.title, matches: best.slice(0, 3).map((r) => ({ problem: r.label, starting_at: r.price })) };
}

export function businessInfo() {
  return {
    name: SITE.name, owner_technician: SITE.owner, phone: SITE.phone, address: `${SITE.street}, ${SITE.city}, ${SITE.region} ${SITE.zip}`, hours: SITE.hours,
    pricing: SITE.diagnostic,
    credentials: 'Licensed for refrigeration work, EPA-certified for refrigerants, business insured, 16+ years of experience.',
    warranty: '3 to 12 months on parts and 3 to 12 months on labor, depending on the appliance brand.',
    services: SERVICES.map((s) => s.name), website: SITE.url,
  };
}

export const TOOLS = [
  {
    name: 'get_business_info',
    description: 'Basic facts about Houston Home Fix: services, hours, phone, credentials, warranty and the $65 diagnostic fee.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'check_service_area',
    description: 'Check whether Houston Home Fix services a 5-digit US ZIP code (Houston, Katy and nearby neighborhoods, Texas).',
    inputSchema: { type: 'object', properties: { zip: { type: 'string', description: '5-digit US ZIP code of the repair address' } }, required: ['zip'] },
  },
  {
    name: 'estimate_price',
    description: 'Starting price estimate for a common appliance repair. Returns known=false when we have no listed price; in that case do not guess, use request_callback.',
    inputSchema: { type: 'object', properties: { appliance: { type: 'string', description: 'e.g. refrigerator, washer, dryer, oven, dishwasher' }, problem: { type: 'string', description: 'e.g. fridge not cooling, washer will not drain' } }, required: ['appliance', 'problem'] },
  },
  {
    name: 'request_repair',
    description: 'Submit a repair request on behalf of the customer. The technician will call the customer to confirm a time. Only call this after the customer explicitly agrees to be contacted by phone and SMS (consent=true). Never submit without the real customer name, phone and ZIP.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' }, phone: { type: 'string', description: 'Customer mobile phone, 10 digits' }, zip: { type: 'string', description: 'ZIP of the repair address' },
        appliance: { type: 'string', description: 'Appliance type and brand' }, problem: { type: 'string', description: 'What is wrong' },
        consent: { type: 'boolean', description: 'True only if the customer agreed to receive calls and SMS from HomeFix Appliance Repair LLC about this request' },
      },
      required: ['name', 'phone', 'zip', 'appliance', 'problem', 'consent'],
    },
  },
  {
    name: 'request_callback',
    description: 'Use when we cannot answer a question exactly (unusual appliance, unclear price, special request). The technician will call the customer back. Requires customer consent to be contacted.',
    inputSchema: { type: 'object', properties: { name: { type: 'string' }, phone: { type: 'string' }, question: { type: 'string', description: 'What the customer wants to know' }, zip: { type: 'string' }, consent: { type: 'boolean' } }, required: ['name', 'phone', 'question', 'consent'] },
  },
];

// Pure tools run anywhere; request_* tools post to the lead endpoint (client: relative URL, server: handled by the route).
export function runPure(name, args = {}) {
  if (name === 'get_business_info') return businessInfo();
  if (name === 'check_service_area') return areaInfo(args.zip);
  if (name === 'estimate_price') return estimatePrice(args);
  return null;
}
