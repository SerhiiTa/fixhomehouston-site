import { SITE } from '@/lib/site';

export default function robots() {
  if (!SITE.indexable) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
