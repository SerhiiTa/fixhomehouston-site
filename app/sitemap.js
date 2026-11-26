import { allPages } from '@/lib/content';
import { SITE } from '@/lib/site';

export default function sitemap() {
  return allPages.map((p) => ({
    url: SITE.url + p.path,
    lastModified: p.modified || p.date,
    changeFrequency: p.type === 'post' ? 'monthly' : 'weekly',
    priority: p.path === '/' ? 1 : p.type === 'post' ? 0.6 : 0.8,
  }));
}
