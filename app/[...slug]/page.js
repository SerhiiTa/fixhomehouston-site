import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE } from '@/lib/site';
import { allPages, getPage, pageKind, pageH1, bodyWithoutH1, faqItems, posts, brandPages, brandName, areaPages, areaName } from '@/lib/content';
import { Wave, BookCard, PriceBoard, BrandChips, Areas, CtaBand } from '@/components/Sections';
import Services from '@/components/Services';
import LeadForm from '@/components/LeadForm';

export const dynamicParams = false;

const toPath = (slug) => '/' + slug.join('/') + '/';

export function generateStaticParams() {
  return allPages.filter((p) => p.path !== '/').map((p) => ({ slug: p.path.split('/').filter(Boolean) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getPage(toPath(slug));
  if (!p) return {};
  const meta = {
    title: p.seoTitle,
    description: p.description || undefined,
    alternates: { canonical: p.path },
    openGraph: { title: p.seoTitle, description: p.description || undefined, url: p.path, type: p.type === 'post' ? 'article' : 'website', ...(p.thumb ? { images: [p.thumb] } : {}) },
  };
  return meta;
}

const Crumbs = ({ p }) => (
  <p className="crumbs">
    <Link href="/">Home</Link> /{' '}
    {p.type === 'post' ? <><Link href="/appliance-issues-and-fixes/">Guides</Link> / </> : null}
    {pageKind(p) === 'brand' ? <><Link href="/brands-we-service-repair/">Brands</Link> / </> : null}
    {pageKind(p) === 'area' ? <><Link href="/#areas">Service areas</Link> / </> : null}
    {pageH1(p)}
  </p>
);

function JsonLd({ p }) {
  const blocks = [];
  const faq = faqItems(p.body);
  if (faq.length) blocks.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  if (p.type === 'post') blocks.push({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, datePublished: p.date, dateModified: p.modified, image: p.thumb ? SITE.url + p.thumb : undefined, author: { '@type': 'Organization', name: SITE.name }, publisher: { '@type': 'Organization', name: SITE.name }, mainEntityOfPage: SITE.url + p.path });
  return blocks.map((b, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(b) }} />);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const p = getPage(toPath(slug));
  if (!p) notFound();
  const kind = pageKind(p);
  const body = bodyWithoutH1(p.body);
  const isContacts = p.slug === 'contacts' || p.slug === 'coupon';
  const isGuides = p.slug === 'appliance-issues-and-fixes';
  const isBrands = p.slug === 'brands-we-service-repair';
  const isService = ['fridge-repair', 'washer-repair', 'dryer-repair', 'dishwasher-repair', 'oven-repair', 'cooktop-repair', 'range-stove-repair', 'ice-maker-repair'].includes(p.slug);

  return (
    <>
      <JsonLd p={p} />
      <section className="hero small">
        <div className="wrap">
          <div style={{ flex: '1 1 520px', minWidth: 0 }}>
            <Crumbs p={p} />
            <h1>{pageH1(p)}</h1>
            {p.type === 'post' ? <p className="fine">Updated {p.modified}</p> : (
              <>
                <p className="lead">{kind === 'area' ? `Same-day appliance repair for homeowners in ${areaName(p)}.` : 'Same-day appliance repair in Houston and Katy, Texas.'}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                  <Link className="btn red" href="/contacts/">Schedule a Repair</Link>
                  <a className="btn ghost" href={`tel:${SITE.tel}`}>Call {SITE.phone}</a>
                </div>
                <p className="fine">{SITE.diagnostic}</p>
              </>
            )}
          </div>
        </div>
        <Wave />
      </section>

      <div className="narrow content">
        {isContacts ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 36 }}>
            <div style={{ flex: '1 1 340px', minWidth: 0 }}>
              <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
              <h2 style={{ fontSize: 28, margin: '8px 0 10px' }}>Call or visit</h2>
              <p><a href={`tel:${SITE.tel}`} style={{ fontSize: 26, fontFamily: 'Zilla Slab,serif', fontWeight: 700 }}>{SITE.phone}</a></p>
              <p>{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.zip}<br />{SITE.hours}</p>
              <p className="meta">{SITE.diagnostic}</p>
            </div>
            <div className="card-book" style={{ flex: '1 1 340px' }}><h2>Request a repair</h2><p>Tell us what is wrong and we call you back.</p><LeadForm /></div>
          </div>
        ) : (
          <>
            {p.type === 'post' && p.thumb ? <img src={p.thumb} alt="" style={{ width: '100%', borderRadius: 18, marginBottom: 24 }} /> : null}
            <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
          </>
        )}
      </div>

      {isGuides ? (
        <div className="wrap content"><div className="post-grid">
          {posts.map((x) => (
            <Link className="post-card" key={x.path} href={x.path}>
              {x.thumb ? <img src={x.thumb} alt="" loading="lazy" /> : null}
              <span>{x.title}</span>
            </Link>
          ))}
        </div></div>
      ) : null}

      {isBrands ? <BrandChips title="Choose your brand" /> : null}
      {kind === 'area' ? <Services title={`Appliances we repair in ${areaName(p)}`} /> : null}
      {(kind === 'area' || kind === 'brand' || isService) ? <PriceBoard /> : null}
      {(kind === 'area' || isService) ? <BrandChips /> : null}
      {p.type === 'post' ? <Services title="Need it fixed?" sub="Choose your appliance and we will give you a quote before any work starts." /> : null}
      {!isContacts ? <Areas /> : null}
      <CtaBand />
    </>
  );
}
