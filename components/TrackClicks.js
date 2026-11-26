'use client';
import { useEffect } from 'react';

// GA4 events: phone taps and Google Maps / reviews clicks. Only fires when GA is loaded (launch mode).
export default function TrackClicks() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || !window.gtag) return;
      const h = a.getAttribute('href') || '';
      if (h.startsWith('tel:')) window.gtag('event', 'phone_click', { link_url: h });
      else if (h.includes('google.com/maps') || h.includes('share.google')) window.gtag('event', 'google_profile_click', { link_url: h });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
