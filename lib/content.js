import fs from 'node:fs';
import path from 'node:path';

const pages = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', 'pages.json'), 'utf8'));
const byPath = new Map(pages.map((p) => [p.path, p]));

export const allPages = pages;
export const getPage = (p) => byPath.get(p);

const isArea = (p) => p.type === 'page' && p.slug.startsWith('appliance-repair-');
const isBrand = (p) => p.type === 'page' && p.slug.endsWith('-appliance-repair');

export const areaPages = pages.filter(isArea);
export const brandPages = pages.filter(isBrand);
export const posts = pages.filter((p) => p.type === 'post').sort((a, b) => b.date.localeCompare(a.date));
export const pageKind = (p) => (p.type === 'post' ? 'post' : isArea(p) ? 'area' : isBrand(p) ? 'brand' : 'page');

export function brandName(p) {
  const m = p.seoTitle.match(/^(.*?)\s+(Appliance|Refrigerator)\s+Repair/i);
  return (m ? m[1] : p.title).replace(/^Asco$/i, 'Asko');
}
export function areaName(p) {
  const m = p.seoTitle.match(/^Appliance Repair\s+(.*?)(?:\s+Houston)?\s+TX/i);
  return m ? m[1] : p.title;
}

// The page H1: the title written for the page, never duplicated from the SEO title suffix.
export function pageH1(p) {
  if (p.h1) return p.h1;
  const k = pageKind(p);
  if (k === 'post') return p.title;
  if (k === 'brand') return `${brandName(p)} appliance repair in Houston, TX`;
  if (k === 'area') return `Appliance repair in ${areaName(p)}, Houston TX`;
  return p.seoTitle.split(/\s[|—-]\s/)[0];
}

// Strip the page's own <h1> from the body (the layout renders it).
export const bodyWithoutH1 = (body) => body.replace(/<h1>.*?<\/h1>/s, '');

export function faqItems(body) {
  const out = [];
  for (const m of body.matchAll(/<details><summary>(.*?)<\/summary><p>(.*?)<\/p><\/details>/gs)) {
    out.push({ q: m[1].replace(/<[^>]+>/g, '').trim(), a: m[2].replace(/<[^>]+>/g, '').trim() });
  }
  return out;
}
