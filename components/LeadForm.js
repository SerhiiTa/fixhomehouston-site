'use client';
import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';

// US phone: keep digits only (drop leading 1), format as (XXX) XXX-XXXX
function fmtPhone(v) {
  let d = String(v).replace(/\D/g, '');
  if (d.length > 10 && d.startsWith('1')) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}
const validPhone = (v) => /^[2-9]\d{2}[2-9]\d{6}$/.test(v.replace(/\D/g, ''));

export default function LeadForm({ compact = false }) {
  const [state, setState] = useState({ status: 'idle', msg: '' });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [problem, setProblem] = useState('');
  const [notes, setNotes] = useState('');
  const [hp, setHp] = useState('');
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(null); // null | 'ok' | 'outside'
  const closeRef = useRef(null);

  // remember campaign tags (utm_*, gclid) from the landing URL so they survive navigation to the form
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'];
      if (keys.some((k) => q.get(k))) {
        const a = {};
        keys.forEach((k) => { if (q.get(k)) a[k.replace('utm_', '')] = q.get(k).slice(0, 240); });
        sessionStorage.setItem('hhf_attr', JSON.stringify(a));
      }
    } catch (err) {}
  }, []);

  useEffect(() => {
    if (!done) return;
    closeRef.current && closeRef.current.focus();
    const onKey = (ev) => { if (ev.key === 'Escape') setDone(null); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [done]);

  // compact (home) form: ZIP appears once name and phone are filled
  const showZip = !compact || (name.trim().length > 1 && validPhone(phone)) || zip.length > 0;
  const phoneBad = phone && !validPhone(phone);

  async function onSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!validPhone(phone)) { setState({ status: 'err', msg: 'Please enter a valid US phone number, 10 digits.' }); return; }
    if (!/^\d{5}$/.test(zip)) { setState({ status: 'err', msg: 'Please enter your 5-digit US ZIP code.' }); return; }
    setState({ status: 'sending', msg: '' });
    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, zip, problem, notes, website: hp, utm: (() => { try { return JSON.parse(sessionStorage.getItem('hhf_attr') || '{}'); } catch (err) { return {}; } })() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setName(''); setPhone(''); setZip(''); setProblem(''); setNotes(''); setTouched(false);
        try { window.gtag && window.gtag('event', data.outside ? 'lead_out_of_area' : 'generate_lead', { form: 'request_repair' }); } catch (err) {}
        setState({ status: 'idle', msg: '' });
        setDone(data.outside ? 'outside' : 'ok');
      } else {
        setState({ status: 'err', msg: data.message || `We could not send your request. Please call ${SITE.phone}.` });
      }
    } catch {
      setState({ status: 'err', msg: `We could not send your request. Please call ${SITE.phone}.` });
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <label>Your name<input name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required /></label>
      <label>Phone (US)<input name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="(555) 123-4567" maxLength={14} value={phone} onChange={(e) => setPhone(fmtPhone(e.target.value))} aria-invalid={touched && phoneBad ? 'true' : undefined} required /></label>
      {showZip && <label>ZIP code<input name="zip" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="77043" maxLength={5} pattern="\d{5}" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))} required /></label>}
      <label>Appliance and problem<input name="problem" type="text" placeholder="Example: Sub-Zero fridge not cooling" value={problem} onChange={(e) => setProblem(e.target.value)} required /></label>
      {!compact && <label>Anything else we should know<textarea name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>}
      <input className="hp" name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
      <button className="btn red" type="submit" disabled={state.status === 'sending'}>{state.status === 'sending' ? 'Sending…' : 'Send request'}</button>
      <p className="consent">By submitting this form you agree to receive calls and text messages from {SITE.legalName} about your request. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out or HELP for help. See our <a href="/privacy-policy/">Privacy Policy</a> and <a href="/terms/">Terms of Service</a>.</p>
      {done && (
        <div className="modal-back" onClick={() => setDone(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="done-title" onClick={(ev) => ev.stopPropagation()}>
            <div className="modal-ico" aria-hidden="true">{done === 'ok' ? '✓' : '★'}</div>
            <h3 id="done-title">{done === 'ok' ? 'Your request is received' : 'Thank you, we got your request'}</h3>
            {done === 'ok'
              ? <p>We will contact you shortly by phone or text to confirm your appointment. Your {SITE.diagnostic.toLowerCase().includes('$65') ? '$65 diagnostic is applied toward the repair.' : 'diagnostic is applied toward the repair.'}</p>
              : <p>Your ZIP code is outside our usual service area, but we will contact you shortly to clarify whether we can help.</p>}
            <p className="modal-fine">Need us sooner? Call <a href={`tel:${SITE.tel}`}>{SITE.phone}</a></p>
            <button ref={closeRef} type="button" className="btn red" onClick={() => setDone(null)}>OK</button>
          </div>
        </div>
      )}
      {state.msg ? <p className={`msg ${state.status === 'ok' ? 'ok' : 'err'}`} role="status">{state.msg}</p> : null}
    </form>
  );
}
