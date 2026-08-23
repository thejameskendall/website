/*
  Dev flags.
  SHOW_DRAFTS: while content migration is pending, every collection entry is
  draft: true — with this on, drafts render (tagged [DRAFT]) so the design is
  visible. Flip to false before launch so drafts disappear everywhere at once.
*/
export const SHOW_DRAFTS = true;

/*
  NOINDEX_SITE: this site currently only lives at the Workers preview URL
  (website.jameswilliamkendall.workers.dev), not the real domain yet. With
  this on, every page gets <meta name="robots" content="noindex, nofollow">
  and robots.txt disallows all crawling — stops Google indexing the preview
  URL as a separate, duplicate copy of the site before the domain transfer
  happens. Flip to false once james-kendall.co.uk is live and pointed here.
*/
export const NOINDEX_SITE = true;
