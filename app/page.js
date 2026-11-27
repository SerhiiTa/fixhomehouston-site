import Link from 'next/link';
import { SITE } from '@/lib/site';
import { getPage } from '@/lib/content';
import { SmsConsent, Trust, Wave, BookCard, PriceBoard, BrandChips, Areas, Reviews, Benefits, LocationMap, CtaBand } from '@/components/Sections';
import Services from '@/components/Services';

const home = getPage('/');

export function generateMetadata() {
  return {
    title: home?.seoTitle,
    description: home?.description,
    alternates: { canonical: '/' },
    openGraph: { title: home?.seoTitle, description: home?.description, url: '/', type: 'website' },
  };
}

export default function Home() {
  return (
    <>
      <section className="hero" id="top">
        <div className="wrap">
          <div style={{ flex: '1 1 480px', minWidth: 0 }}>
            <div className="eyebrow">Houston &amp; Katy, Texas</div>
            <h1>Honest appliance repair, <em>right here in Houston.</em></h1>
            <p className="lead">In-home repair for refrigerators, washers, dryers and kitchen appliances, including premium built-ins.</p>
            {SITE.faceImage ? (
              <div className="tech">
                <img src={SITE.faceImage} alt={`${SITE.owner}, Houston Home Fix appliance repair technician`} />
                <div><b>{SITE.owner}, your appliance repair technician</b><span>Licensed, insured &amp; EPA-certified · 16+ years of experience</span></div>
              </div>
            ) : null}
            <div className="cta-row">
              <Link className="btn red" href="/contacts/#request">Schedule a Repair</Link>
              <a className="btn ghost" href={`tel:${SITE.tel}`}>Call {SITE.phone}</a>
            </div>
            <p className="fine">{SITE.diagnostic}</p>
            <SmsConsent className="sms light" />
          </div>
          {SITE.heroImage
            ? <div className="hero-img"><img src={SITE.heroImage} alt="Houston Home Fix technician repairing a refrigerator" /></div>
            : <BookCard />}
        </div>
        <Wave />
      </section>
      <Trust />
      <Services />
      <BrandChips />
      <Benefits />
      <section className="wrap">
        <div className="how"><div className="in">
          <h2>A clear price before we start.</h2>
          <div className="steps">
            <div className="step"><b>1</b>Tell us what is wrong</div>
            <div className="step"><b>2</b>Get a diagnosis and a quote</div>
            <div className="step"><b>3</b>Approve the repair</div>
          </div>
        </div></div>
      </section>
      <PriceBoard />
      <section className="s"><div className="wrap">
        <div className="about">
          {SITE.aboutImage ? <div className="pic"><img src={SITE.aboutImage} alt={`${SITE.owner}, appliance repair technician`} /></div> : null}
          <div className="txt">
            <h2 className="t">{SITE.owner}, your appliance repair technician.</h2>
            <p>Houston Home Fix is owner-operated by {SITE.owner}, a hands-on, licensed and insured appliance technician with more than 16 years of experience, serving homeowners in Houston, Katy and surrounding areas. You get clear communication, careful troubleshooting and a straightforward repair process from start to finish.</p>
          </div>
        </div>
      </div></section>
      <Reviews />
      <Areas />
      <LocationMap />
      <CtaBand />
    </>
  );
}
