import { SITE } from '@/lib/site';
import { LegalShell } from '@/components/Legal';

export const metadata = { title: 'Privacy Policy - Houston Home Fix', alternates: { canonical: '/privacy-policy/' } };

export default function Privacy() {
  return (
    <LegalShell title="Privacy Policy" updated="November 26, 2026">
      <p>{SITE.legalName}, doing business as {SITE.name} (“we”, “us”), provides appliance repair in Houston and Katy, Texas. This policy explains what we collect when you use this website, call us, text us or send a request.</p>
      <h2>What we collect</h2>
      <p>Your name, phone number, address or neighborhood, appliance details and the description of your problem, when you submit a form, call or text us. We also collect basic website usage data (pages viewed, device and browser type) through Google Analytics.</p>
      <h2>How we use it</h2>
      <p>To contact you about your request, schedule and perform repairs, send appointment updates and invoices, and improve our service.</p>
      <h2>Text messages (SMS)</h2>
      <p>If you call or text {SITE.phone}, or submit a request, you agree to receive calls and text messages from {SITE.legalName} about your service request, such as appointment confirmations, technician arrival updates and follow-ups. Message frequency varies. Message and data rates may apply. Reply STOP at any time to opt out, or HELP for help.</p>
      <p>If you or an assistant acting for you (including an AI assistant) give us your phone number in connection with a service request, you agree that we may call you and send service text messages about that request only. We never use such numbers for advertising or marketing.</p>
      <p>We do not sell, rent or share mobile phone numbers or SMS opt-in data with third parties or affiliates for their marketing or promotional purposes.</p>
      <h2>Sharing</h2>
      <p>We share information only with service providers that help us operate (for example messaging, hosting and analytics providers) and when required by law. They may use it only to provide services to us.</p>
      <h2>Retention and your choices</h2>
      <p>We keep service records as long as needed for warranty, tax and legal purposes. To ask us to correct or delete your information, call {SITE.phone}.</p>
      <h2>Contact</h2>
      <p>{SITE.legalName}, {SITE.street}, {SITE.city}, {SITE.region} {SITE.zip}. Phone: {SITE.phone}.</p>
    </LegalShell>
  );
}
