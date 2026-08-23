import type { APIRoute } from 'astro';
import { NOINDEX_SITE } from '../lib/flags';

// Mirrors NOINDEX_SITE in lib/flags.ts: while this site only lives at the
// Workers preview URL, block crawling entirely rather than relying on the
// per-page noindex meta tag alone. Flip NOINDEX_SITE to false once the real
// domain is live and this becomes the switch that opens the site back up.
export const GET: APIRoute = ({ site }) => {
  const body = NOINDEX_SITE
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nDisallow: /admin\n\nSitemap: ${new URL('sitemap-index.xml', site).toString()}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
