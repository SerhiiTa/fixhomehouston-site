import Link from 'next/link';
import { SITE, PRICES, AREAS } from '@/lib/site';
import { brandPages, brandName, getPage } from '@/lib/content';
import LeadForm from './LeadForm';
import TrustindexWidget from './TrustindexWidget';

export function Seal() {
  return (
    <svg className="seal" viewBox="0 0 160 160" role="img" aria-label="$65 diagnostic applied toward repair">
      <defs><path id="sealpath" d="M80,80 m-58,0 a58,58 0 1,1 116,0 a58,58 0 1,1 -116,0" /></defs>
      <circle cx="80" cy="80" r="76" fill="#A63D2F" stroke="#E3C27E" strokeWidth="3" />
      <circle cx="80" cy="80" r="64" fill="none" stroke="#E3C27E" strokeWidth="1.5" strokeDasharray="2 4" />
      <text fontFamily="Zilla Slab,serif" fontWeight="700" fontSize="14" fill="#FBF7EC" letterSpacing="2"><textPath href="#sealpath">$65 DIAGNOSTIC · APPLIED TO REPAIR ·</textPath></text>
      <polygon fill="#E3C27E" points="80,52 86,70 105,70 90,81 96,100 80,89 64,100 70,81 55,70 74,70" />
    </svg>
  );
}

export function Wave({ color = '#F5EEDD' }) {
  return (
    <svg className="wave" viewBox="0 0 1440 56" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0,56 L0,30 C240,0 480,0 720,22 C960,44 1200,48 1440,18 L1440,56 Z" fill={color} />
    </svg>
  );
}

export function BookCard({ title = 'Request a repair' }) {
  return (
    <div className="card-book">
      <Seal />
      <h2>{title}</h2>
      <p>Tell us what is wrong and we call you back. {SITE.diagnostic}</p>
      <LeadForm compact />
    </div>
  );
}

export function Trust() {
  return (
    <div className="trust"><div className="wrap">
      <div className="it">Owner-operated</div>
      <div className="it">Estimate before repairs</div>
      <div className="it">Local service</div>
      <div className="it">$65 diagnostic, credited</div>
    </div></div>
  );
}

export function PriceBoard() {
  return (
    <section className="s" id="pricing"><div className="wrap">
      <div className="head"><h2 className="t">What repairs cost in Houston</h2></div>
      <p className="sub">Starting prices for the problems we see every week. Your exact price depends on the make, the model and the part.</p>
      <div className="grid g3">
        {PRICES.map((g) => (
          <div className="board" key={g.title}><div className="in">
            <h3>{g.title}</h3><p className="incl">{g.incl}</p>
            {g.rows.map(([n, p]) => <div className="row" key={n}>{n}<i /><b>{p}</b></div>)}
          </div></div>
        ))}
      </div>
      <div className="diag"><span><b>$65 diagnostic fee.</b> It is applied toward the cost of your repair.</span><Link className="btn red" href="/contacts/">Book a diagnostic</Link></div>
      <p className="note">Prices are starting estimates and vary with the complexity of the repair and the make and model of the appliance.</p>
    </div></section>
  );
}

export function BrandChips({ title = 'From everyday appliances to premium built-ins' }) {
  return (
    <section className="s" id="brands"><div className="wrap">
      <div className="brandline"><h2>{title}</h2></div>
      <div className="chips">
        {brandPages.map((b) => <Link className="chip" key={b.path} href={b.path}>{brandName(b)}</Link>)}
      </div>
    </div></section>
  );
}

export function Areas() {
  return (
    <section className="areas" id="areas"><div className="wrap">
      <h2 className="t">Houston, Katy &amp; nearby neighborhoods.</h2>
      <p style={{ margin: '12px 0 0', fontSize: 19 }}>Proudly serving homeowners across Houston and Katy, including Bunker Hill Village, Hunters Creek Village and Spring.</p>
      <ul>
        {AREAS.filter(([, p]) => getPage(p)).map(([n, p]) => <li key={p}><Link href={p}>{n}</Link></li>)}
      </ul>
    </div></section>
  );
}

export function Reviews() {
  return (
    <section className="s" id="reviews"><div className="wrap">
      <div className="head"><h2 className="t">Honest reviews from real customers</h2></div>
      {SITE.trustindexId ? <TrustindexWidget id={SITE.trustindexId} /> : (
        <div className="g-rating">
          <span className="stars" aria-hidden="true">★★★★★</span>
          <b>{SITE.rating}</b>
          <span>on Google · {SITE.ratingCount} reviews</span>
        </div>
      )}
      <p style={{ marginTop: 22 }}><a className="btn navy" href={SITE.reviewsUrl} target="_blank" rel="noopener noreferrer">Read all reviews on Google</a></p>
    </div></section>
  );
}

export function LocationMap() {
  return (
    <section className="s" id="location"><div className="wrap">
      <div className="head"><h2 className="t">Find us</h2></div>
      <div className="loc">
        <div className="loc-card">
          <h3>{SITE.name}</h3>
          <p>{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.zip}</p>
          <p>{SITE.hours}</p>
          <p><a href={`tel:${SITE.tel}`}><b>{SITE.phone}</b></a></p>
          <p className="g-mini"><span className="stars" aria-hidden="true">★★★★★</span> {SITE.rating} on Google ({SITE.ratingCount})</p>
          <a className="btn red" href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </div>
        <div className="loc-map">
          <iframe title={`Map: ${SITE.name}, ${SITE.street}, ${SITE.city}`} src={SITE.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
        </div>
      </div>
    </div></section>
  );
}

export function CtaBand({ title = 'Appliance down? Give us a call.' }) {
  return (
    <section className="cta"><div className="wrap">
      <div><h2>{title}</h2><p>Describe the problem and we give you a time. {SITE.diagnostic}</p></div>
      <div style={{ textAlign: 'center' }}><a className="phone" href={`tel:${SITE.tel}`}>{SITE.phone}</a></div>
    </div><div className="wrap"><SmsConsent className="sms light" /></div></section>
  );
}

export function SmsConsent({ className = 'sms' }) {
  return (
    <p className={className}>
      By calling or texting {SITE.phone}, you agree to receive calls and SMS messages from {SITE.legalName}. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out or HELP for help. See our <Link href="/privacy-policy/">Privacy Policy</Link> and <Link href="/terms/">Terms of Service</Link>.
    </p>
  );
}
