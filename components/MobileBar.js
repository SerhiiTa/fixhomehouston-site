import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function MobileBar() {
  return (
    <div className="mbar">
      <a className="btn ghostd" href={`tel:${SITE.tel}`}>Call now</a>
      <Link className="btn red" href="/contacts/">Request repair</Link>
    </div>
  );
}
