import Link from 'next/link';
import { SITE } from '@/lib/site';
import { AREA_DATA, SERVICE_LINKS, zipStatus } from '@/lib/areas-data';

export default function AreaDetails({ path }) {
  const d = AREA_DATA[path];
  if (!d) return null;
  const zips = d.zips.map(zipStatus);
  const names = Object.fromEntries(Object.entries(AREA_DATA).map(([p, v]) => [p, v.name]));
  return (
    <div className="area-detail">
      <h2>Appliance repair in {d.name}: ZIP codes and neighborhoods</h2>
      {d.intro.map((t, i) => <p key={i}>{t}</p>)}

      <h3>ZIP codes we serve in {d.short}</h3>
      <ul className="zip-chips">
        {zips.map((z) => (
          <li key={z.zip} className={z.far ? 'far' : ''}><b>{z.zip}</b><span>{z.far ? 'extended area, timing confirmed by phone' : 'standard service area'}</span></li>
        ))}
      </ul>

      <h3>Neighborhoods and landmarks we cover</h3>
      <p className="places">{d.places.join(' · ')}</p>

      <h3>What we repair in {d.short}</h3>
      <ul className="svc-links">
        {SERVICE_LINKS.map(([href, label]) => <li key={href}><Link href={href}>{label} in {d.short}</Link></li>)}
      </ul>
      <p>We repair all major brands, including premium built-in brands. See <Link href="/brands-we-service-repair/">all brands we service</Link>. Every repair starts with a {SITE.diagnostic.toLowerCase()}</p>

      <h3>Good to know in {d.short}</h3>
      <ul className="tips">{d.tips.map((t, i) => <li key={i}>{t}</li>)}</ul>

      <h3>Questions from {d.short} customers</h3>
      <div className="faq">
        {d.faq.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>

      <h3>Nearby areas we serve</h3>
      <p className="nearby">{d.nearby.map((p, i) => <span key={p}>{i ? ' · ' : ''}<Link href={p}>{names[p]}</Link></span>)}</p>
    </div>
  );
}
