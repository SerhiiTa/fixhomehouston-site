/** @type {import('next').NextConfig} */
const permanent = true;

const nextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      // Broken URLs Google reported as redirect errors
      { source: '/kitchenaid-appliance-', destination: '/kitchenaid-appliance-repair/', permanent },
      { source: '/kitchenaid-appliance-/', destination: '/kitchenaid-appliance-repair/', permanent },
      { source: '/frigidaire-appliance-', destination: '/frigidaire-appliance-repair/', permanent },
      { source: '/frigidaire-appliance-/', destination: '/frigidaire-appliance-repair/', permanent },
      { source: '/fridge-ice-maker-is-not-', destination: '/fridge-ice-maker-is-not-working/', permanent },
      { source: '/fridge-ice-maker-is-not-/', destination: '/fridge-ice-maker-is-not-working/', permanent },
      { source: '/brand/:path*', destination: '/:path*', permanent },
      // WordPress archive URLs that no longer exist
      { source: '/tag/:path*', destination: '/appliance-issues-and-fixes/', permanent },
      { source: '/category/:path*', destination: '/appliance-issues-and-fixes/', permanent },
      { source: '/author/:path*', destination: '/appliance-issues-and-fixes/', permanent },
      { source: '/refrigerator-issues', destination: '/appliance-issues-and-fixes/', permanent },
      { source: '/refrigerator-issues/', destination: '/appliance-issues-and-fixes/', permanent },
      { source: '/washer-issues', destination: '/appliance-issues-and-fixes/', permanent },
      { source: '/washer-issues/', destination: '/appliance-issues-and-fixes/', permanent },
      // Old WordPress sitemap URLs that may still be known to Google
      { source: '/sitemap_index.xml', destination: '/sitemap.xml', permanent },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', permanent },
      { source: '/page-sitemap.xml', destination: '/sitemap.xml', permanent },
      { source: '/post-sitemap.xml', destination: '/sitemap.xml', permanent },
      { source: '/feed', destination: '/', permanent },
      { source: '/feed/', destination: '/', permanent },
      { source: '/:slug/feed', destination: '/:slug/', permanent },
      { source: '/:slug/feed/', destination: '/:slug/', permanent },
      { source: '/comments/feed', destination: '/', permanent },
      { source: '/comments/feed/', destination: '/', permanent },
    ];
  },
};

export default nextConfig;
