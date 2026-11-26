import Link from 'next/link';
import { SITE } from '@/lib/site';
import { SmsConsent } from '@/components/Sections';

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div><b>{SITE.name}</b><br />{SITE.street}<br />{SITE.city}, {SITE.region} {SITE.zip}</div>
        <div>{SITE.hours}<br /><a href={`tel:${SITE.tel}`}>{SITE.phone}</a></div>
        <div>
          <Link href="/brands-we-service-repair/">Brands we repair</Link><br />
          <Link href="/appliance-issues-and-fixes/">Repair guides</Link><br />
          <Link href="/contacts/">Contact us</Link>
        </div>
      </div>
      <div className="wrap"><SmsConsent className="sms light" /><p className="sms light"><Link href="/privacy-policy/">Privacy Policy</Link> · <Link href="/terms/">Terms of Service</Link> · © {new Date().getFullYear()} {SITE.name}</p></div>
    </footer>
  );
}
