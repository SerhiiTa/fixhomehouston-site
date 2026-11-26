import { SITE } from '@/lib/site';
import { LegalShell } from '@/components/Legal';

export const metadata = { title: 'Terms of Service - Houston Home Fix', alternates: { canonical: '/terms/' } };

export default function Terms() {
  return (
    <LegalShell title="Terms of Service" updated="November 26, 2026">
      <p>These terms apply to your use of this website and to messages and service from {SITE.legalName}, doing business as {SITE.name}.</p>
      <h2>Services and pricing</h2>
      <p>We repair household appliances in Houston, Katy and nearby areas. {SITE.diagnostic} Prices shown on this website are starting estimates; the final price depends on the appliance, the part and the repair, and is quoted before work begins.</p>
      <h2>Warranty</h2>
      <p>Repairs are covered by a warranty of 3 to 12 months on parts and 3 to 12 months on labor, depending on the appliance brand. The warranty period for your repair is stated on your invoice.</p>
      <h2>SMS terms</h2>
      <p>If a request is submitted for you by an assistant or other representative, including an AI assistant, providing your phone number means you agree to calls and service text messages about that request only, never advertising or marketing.</p>
      <p>By calling or texting {SITE.phone}, or by submitting a request on this website, you agree to receive calls and text messages from {SITE.legalName} about your service request, such as scheduling, technician arrival and follow-up. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time, or HELP for help. Carriers are not liable for delayed or undelivered messages. See our Privacy Policy for how we handle your information.</p>
      <h2>Website use</h2>
      <p>Information on this website is general and may change. It is not a guarantee of a specific repair outcome or price.</p>
      <h2>Contact</h2>
      <p>{SITE.legalName}, {SITE.street}, {SITE.city}, {SITE.region} {SITE.zip}. Phone: {SITE.phone}.</p>
    </LegalShell>
  );
}
