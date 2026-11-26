import Link from 'next/link';
import { SERVICES } from '@/lib/site';
import { getPage } from '@/lib/content';

const ICON = 'M6 3h12v18H6zM6 10h12M9 6v2M9 13v3';

export default function Services({ title = 'What we repair', sub }) {
  return (
    <section className="s" id="services"><div className="wrap">
      <div className="head"><h2 className="t">{title}</h2></div>
      {sub ? <p className="sub">{sub}</p> : null}
      <div className="grid g4">
        {SERVICES.filter((s) => getPage(s.path)).map((s) => {
          const img = getPage(s.path)?.thumb;
          return (
            <Link className="tile" href={s.path} key={s.path}>
              <div className="ph">
                {img ? <img src={img} alt="" loading="lazy" /> : <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#13233F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICON} /></svg>}
              </div>
              <div className="cap">{s.name}</div>
              <p>{s.note}</p>
            </Link>
          );
        })}
      </div>
    </div></section>
  );
}
