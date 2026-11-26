import '@fontsource/zilla-slab/500.css';
import '@fontsource/zilla-slab/600.css';
import '@fontsource/zilla-slab/700.css';
import '@fontsource/zilla-slab/600-italic.css';
import '@fontsource/source-sans-3/400.css';
import '@fontsource/source-sans-3/600.css';
import '@fontsource/source-sans-3/700.css';
import './globals.css';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';
import TrackClicks from '@/components/TrackClicks';
import WebMcp from '@/components/WebMcp';
import { SITE } from '@/lib/site';

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Appliance Repair Houston TX — Same Day | Houston Home Fix', template: '%s' },
  verification: { google: 'tVHZffAFbw_1S0ZFCo51Bivf9_oMYgGu2eFvoWjqCZI' },
  robots: SITE.indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport = { width: 'device-width', initialScale: 1, themeColor: '#13233F' };

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: SITE.name,
  description: 'Located near Memorial, Bunker Hill Village, Hunters Creek Village, Uptown, and the Energy Corridor, Houston Home Fix provides top-quality repair services for high-end home appliances. Licensed, insured technicians specialize in brands like Sub-Zero, Thermador, Viking, JennAir, KitchenAid, LG, and Samsung.',
  image: `${SITE.url}/wp-content/uploads/2025/02/Houston-appliance-fix-Header-main-1.jpg`,
  url: SITE.url,
  telephone: SITE.tel,
  priceRange: '$100-$300',
  address: { '@type': 'PostalAddress', streetAddress: SITE.street, addressLocality: SITE.city, addressRegion: SITE.region, postalCode: SITE.zip, addressCountry: 'US' },
  geo: { '@type': 'GeoCoordinates', latitude: 29.7873602, longitude: -95.5748883 },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' }],
  areaServed: ['Houston, TX', 'Katy, TX', 'Spring, TX', 'Sugar Land, TX', 'Spring Branch, Houston', 'Downtown Houston', 'Midtown Houston', 'Montrose', 'The Heights', 'River Oaks', 'Uptown Houston', 'West University Place', 'Bellaire', 'Memorial City', 'Hunters Creek Village', 'Bunker Hill Village', 'Energy Corridor'],
  knowsAbout: ['Refrigerator repair', 'Sub-Zero repair', 'Washer repair', 'Dryer repair', 'Dishwasher repair', 'Oven repair', 'Cooktop repair', 'Range repair', 'Ice maker repair'],
  slogan: 'Honest appliance repair, right here in Houston.',
  sameAs: ['https://www.facebook.com/Houstonhomefixappliance', 'https://g.co/kgs/D4SwHmd'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
        <Header />
        <main>{children}</main>
        <Footer />
        <MobileBar />
        <TrackClicks />
        <WebMcp />
        {SITE.indexable && SITE.gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaId}');`}</Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
