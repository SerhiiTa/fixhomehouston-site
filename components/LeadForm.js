'use client';
import { useState } from 'react';
import { SITE } from '@/lib/site';

export default function LeadForm({ compact = false }) {
  const [state, setState] = useState({ status: 'idle', msg: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState({ status: 'sending', msg: '' });
    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        e.currentTarget.reset();
        setState({ status: 'ok', msg: 'Thank you. We will call you shortly to confirm a time.' });
      } else {
        setState({ status: 'err', msg: `We could not send your request. Please call ${SITE.phone}.` });
      }
    } catch {
      setState({ status: 'err', msg: `We could not send your request. Please call ${SITE.phone}.` });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Your name<input name="name" type="text" autoComplete="name" required /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" required /></label>
      <label>Appliance and problem<input name="problem" type="text" placeholder="Example: Sub-Zero fridge not cooling" required /></label>
      {!compact && <label>ZIP code or neighborhood<input name="area" type="text" /></label>}
      {!compact && <label>Anything else we should know<textarea name="notes" /></label>}
      <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn red" type="submit" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending…' : 'Send request'}</button>
      <p className="consent">By submitting this form you agree to receive calls and text messages from {SITE.legalName} about your request. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out or HELP for help. See our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/terms/">Terms of Service</a>.</p>
      {state.msg ? <p className={`msg ${state.status === 'ok' ? 'ok' : 'err'}`} role="status">{state.msg}</p> : null}
    </form>
  );
}
