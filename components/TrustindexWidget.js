'use client';
import { useEffect, useRef } from 'react';

// Trustindex loader injects the Google reviews widget right where the script tag sits.
export default function TrustindexWidget({ id }) {
  const ref = useRef(null);
  useEffect(() => {
    const box = ref.current;
    if (!box || !id) return;
    const s = document.createElement('script');
    s.src = `https://cdn.trustindex.io/loader.js?${id}`;
    s.defer = true;
    s.async = true;
    box.appendChild(s);
    return () => { box.innerHTML = ''; };
  }, [id]);
  return <div ref={ref} className="ti-box" style={{ minHeight: 260 }} />;
}
