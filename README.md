# james-kendall.co.uk

Personal site: contemporary art photography, commercial photography, video, and writing.

## Stack

- **Astro 5** — static site generator, content collections, image optimisation via sharp.
- **Cloudflare Pages** — hosting, free tier, UK-friendly CDN.
- **Local images** — originals and curated set in `src/assets/images/`. Build-time AVIF/WebP generation.

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to ./dist
npm run preview    # preview the built site
npm run check      # type-check
```

## Project structure

```
src/
├── assets/images/       # curated photo set (originals + processed)
├── components/          # Nav, Footer, etc.
├── content/
│   ├── projects/        # 6 art practice projects (markdown)
│   ├── commercial/      # Portraits, Live Music, Bands, Events, Video
│   ├── writing/         # journalism, essays, project writing
│   └── config.ts        # schema for all three collections
├── layouts/             # BaseLayout
├── pages/               # routes: /, /about, /projects, /commercial, /writing
└── styles/global.css    # placeholder CSS until design spike
```

## Content model

**Projects** (art practice):
- Frontmatter: `title`, `years`, `order`, `summary`, `coverImage`, `relatedWriting[]`, `draft`
- Body: image sequence, captions, essay text

**Commercial** (5 fixed categories):
- Frontmatter: `title`, `order`, `summary`, `coverImage`, `draft`
- Body: description + image grid

**Writing** (journalism, essays, project writing):
- Frontmatter: `title`, `date`, `type` (`journalism` / `essay` / `project-writing`), `publication?`, `externalUrl?`, `relatedProject?`, `summary`, `draft`
- Body: full piece (re-hosted) OR empty with `externalUrl` set (link out)

## Cross-linking

- Project → related writing: `relatedWriting: [slug1, slug2]` in project frontmatter.
- Writing → related project: `relatedProject: slug` in writing frontmatter.
- Rendered automatically at the bottom of project and writing pages.

## Drafts

All content is `draft: true` until reviewed. Drafts excluded from listings and builds in prod.

## Status

Scaffold. No design yet — CSS is placeholder. See `PROGRESS.md`.
