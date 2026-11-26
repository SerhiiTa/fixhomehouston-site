import { SITE } from '@/lib/site';

// Search engines and AI crawlers/agents we explicitly welcome once the site is live.
const BOTS = [
  'Googlebot', 'Google-Extended', 'GoogleOther', 'Bingbot', 'Applebot', 'Applebot-Extended', 'DuckDuckBot',
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'YouBot', 'DuckAssistBot',
  'CCBot', 'Amazonbot', 'meta-externalagent', 'FacebookBot', 'cohere-ai', 'MistralAI-User', 'Diffbot', 'Bytespider', 'Timpibot',
];

export default function robots() {
  if (!SITE.indexable) return { rules: [{ userAgent: '*', disallow: '/' }] };
  return {
    rules: [
      { userAgent: BOTS, allow: '/', disallow: ['/api/'] },
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
