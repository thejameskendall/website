/*
  Placeholder images until content migration: real Wasted On The Young
  photographs from the design system (assets/photography/), copied to
  public/images/woty/. Only WOTY's own card uses a matching image; the rest
  are stand-ins and are replaced per-project during migration.
*/
const map: Record<string, string> = {
  'wasted-on-the-young': '/images/woty/woty-01-suit-bottle.png',
  'best-before': '/images/woty/woty-04-hug.png',
  'first-dance': '/images/woty/woty-05-crowd-hands.png',
  'much-like-unrequited-love': '/images/woty/woty-07-limes.png',
  'unmade-beds': '/images/woty/woty-06-wasps-plate.png',
  'made-beds': '/images/woty/woty-09-forest.png',
  portraits: '/images/woty/woty-02-gold-headpiece.png',
  'live-music': '/images/woty/woty-05-crowd-hands.png',
  bands: '/images/woty/woty-03-record-digging.png',
  events: '/images/woty/woty-04-hug.png',
  video: '/images/woty/woty-08-tattoos.png',
};

export function placeholderImage(id: string): string | undefined {
  return map[id];
}
