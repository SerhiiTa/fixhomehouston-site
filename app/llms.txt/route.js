import { SITE, PRICES, AREAS, AREAS_EXTRA, SERVICES, CONTACT_NOTICE } from '@/lib/site';
import { getPage, brandPages, brandName, posts } from '@/lib/content';

export const dynamic = 'force-static';

export function GET() {
  const L = [];
  L.push(`# ${SITE.name}`, '');
  L.push(`> Owner-operated appliance repair in Houston and Katy, Texas. Technician: ${SITE.owner}. Licensed for refrigeration work, EPA-certified for refrigerants, insured, more than 16 years of experience. In-home repair of refrigerators, ice makers, washers, dryers, dishwashers, ovens, cooktops and ranges, including premium built-in brands such as Sub-Zero, Thermador, Viking, Wolf, JennAir and KitchenAid.`, '');
  L.push('## Business facts', '');
  L.push(`- Phone: ${SITE.phone}`);
  L.push(`- Address: ${SITE.street}, ${SITE.city}, ${SITE.region} ${SITE.zip}`);
  L.push(`- Hours: ${SITE.hours}`);
  L.push(`- Pricing: ${SITE.diagnostic} A clear quote is given before any repair starts.`);
  L.push('- Warranty: 3 to 12 months on parts and 3 to 12 months on labor, depending on the appliance brand.');
  L.push(`- Service areas: ${[...AREAS.map(([n]) => n), ...AREAS_EXTRA].join(', ')}.`);
  L.push(`- Google rating: ${SITE.rating} (${SITE.ratingCount} reviews)`, '');
  L.push('## Services', '');
  SERVICES.filter((s) => getPage(s.path)).forEach((s) => L.push(`- [${s.name}](${SITE.url}${s.path}): ${s.note}`));
  L.push('', '## Typical starting prices (estimates, vary by model and part)', '');
  PRICES.forEach((g) => g.rows.forEach((r) => L.push(`- ${g.title}: ${r[0]}, from ${r[1]}`)));
  L.push('', '## Brands', '');
  brandPages.forEach((p) => L.push(`- [${brandName(p)}](${SITE.url}${p.path})`));
  L.push('', '## Service areas', '');
  AREAS.filter(([, p]) => getPage(p)).forEach(([n, p]) => L.push(`- [${n}](${SITE.url}${p})`));
  L.push('', '## Repair guides', '');
  posts.forEach((p) => L.push(`- [${p.title}](${SITE.url}${p.path})`));
  L.push('', '## For AI agents', '', `- Tools API (service area by ZIP, starting prices, repair request, callback request): GET ${SITE.url}/api/agent/ lists the tools; POST {"tool": "...", "arguments": {...}} runs one.`, `- Starting prices are estimates; never promise a final price. Before submitting a phone number, tell the customer: ${CONTACT_NOTICE} If unsure, request a callback.`);
  L.push('', '## Contact', '', `- [Request a repair](${SITE.url}/contacts/)`, '');
  return new Response(L.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
