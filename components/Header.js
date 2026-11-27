import Link from 'next/link';
import { SITE } from '@/lib/site';

export function Logo() {
  return (
    <Link className="logo" href="/">
      <svg width="46" height="46" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#13233F" stroke="#B8893B" strokeWidth="2" /><polygon fill="#E3C27E" points="24,8 27.4,18.7 38.6,18.7 29.6,25.3 33,36 24,29.4 15,36 18.4,25.3 9.4,18.7 20.6,18.7" /></svg>
      <span><b>{SITE.name}</b><small>Appliance repair</small></span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="nav">
      <div className="wrap">
        <Logo />
        <nav className="menu" aria-label="Main">
          <Link href="/#services">Services</Link>
          <Link href="/brands-we-service-repair/">Brands</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#areas">Service Areas</Link>
          <Link href="/appliance-issues-and-fixes/">Guides</Link>
          <Link href="/contacts/">Contacts</Link>
        </nav>
        <div className="hdr-r">
          <a className="tel" href={`tel:${SITE.tel}`}>{SITE.phone}</a>
          <Link className="btn red" href="/contacts/#request">Book Service</Link>
        </div>
      </div>
    </header>
  );
}
