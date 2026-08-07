# Progress

Running log of what's done, what's next, decisions made. Updated each session.

## Done — 6 August 2026, later (hero carousel)

- James's call: replace the static grid + exhibition views sections with a single carousel in the hero spread, all plates and exhibition views in one place. Manual navigation only (prev/next + arrow keys), no autoplay — matches the poster system's static, editorial feel.
- Applies to any project with real `images`/`exhibitionViews` data. Projects still on the placeholder fall back to the old single static image, unaffected.
- Fixed a script placement bug during build testing: the `<script>` was rendering after `</html>` instead of inside `<body>`. Caught it, moved it inside `BaseLayout`, verified in the built HTML before committing.
- Committed locally, not yet pushed.

## Done — 6 August 2026 (Cloudflare live, first real content migrated)

- Cloudflare deploy sorted. Cloudflare's moved static sites onto the Workers static-assets path rather than classic Pages, needed one new file, `wrangler.jsonc` (name, compatibility_date, assets directory `./dist`). Live at https://website.jameswilliamkendall.workers.dev.
- Detour: GitHub Desktop had cloned a second, separate copy of the repo into `Documents/GitHub/website`, which is why it kept showing stale state. Fixed by removing that entry from GitHub Desktop and re-adding the real folder (`Claude Cowork/.../New Website/site`) via Add Local Repository.
- First real content migrated: **Wasted On The Young**. James dropped the source material into `New Website/Website Content/Wested On The Young/` (15 plate images, 2 exhibition view photos, TEXT.md with the project statement).
- Schema change: `projects` collection now supports `images[]` and `exhibitionViews[]` arrays (via Astro's `image()` helper, so they get the sharp build pipeline automatically), plus an optional `videoUrl` for later. Old `coverImage` string field kept for the five projects not yet migrated.
- Project detail page rebuilt: real hero image, full plate gallery grid below the text, separate exhibition views section. Falls back to the old single-placeholder logic automatically for anything without real images yet.
- Home and Projects index cards updated to show WOTY's real cover photo instead of the placeholder.
- Build verified clean: 17 pages, all 17 real images processed (avg. ~75% file size reduction to WebP).
- Video not embedded yet — James said the book video is still to come, `videoUrl` field is ready for it.
- Committed locally (`git log`: "Real gallery support: Wasted On The Young content migration"), not yet pushed — James needs to push via GitHub Desktop next session.

### Open question for James

- TEXT.md gives the plate caption as "2022-2023" but the frontmatter elsewhere (and the existing project summary) says "2022–2024". Used 2022–2024 across all 15 captions for consistency with the rest of the site. Confirm this is right, or say which years are correct.
- Small cosmetic gap: the small thumbnail on the homepage/Projects grid card uses the plain JPEG rather than the compressed WebP version (the full gallery and hero do use WebP correctly). Works fine, just not optimised. Low priority, can fix later.

## Done — 5 August 2026, later (git repo live)

- `git init` done in `site/`, first commit made: 52 files, message "Initial commit: Astro poster-system site", branch `main`.
- Trap hit and fixed: the mount blocks file deletion by design (data-safety guard). A failed first `git init` left a stuck `.git/index.lock` that even `rm -rf` couldn't clear. Fixed by calling `allow_cowork_file_delete` with the VM path (`/sessions/.../mnt/New Website/site/.git/index.lock`), not the Mac-facing path, which unblocked deletion for the New Website folder. Re-ran `git init` clean after.
- Pushed to GitHub: github.com/thejameskendall/website, branch `main` tracking `origin/main`. Used a fine-grained PAT for the one-time push, then stripped it from `.git/config` (verified clean, no token stored on disk).
- Decided: GitHub Desktop, installed and signed in on James's Mac. Token from the one-time push was revoked on GitHub. Add the `site` folder as a local repo in GitHub Desktop (File → Add Local Repository) to pick up day-to-day pushes from here on.
- Next: connect Cloudflare Pages to the GitHub repo (build command `npm run build`, output `dist`).

## Done — 5 August 2026 (services plan, deadline confirmed)

- Squarespace contract ends **mid-September 2026** — this is the hard deadline for going live.
- Full services plan agreed: GitHub (free, code + history) → Cloudflare Pages (free, hosting + build) → Cloudflare Registrar (domain transfer, ~£5/yr, replaces Squarespace's ~£20/yr) → Cloudflare Web Analytics (free). No database, no members area carried over.
- CMS decision: **Sveltia CMS**, a free git-based admin UI mounted at `/admin`. Logs in via GitHub, edits markdown + uploads images, commits straight to the repo. No separate hosting or monthly cost. Add this after the core site is live and deployed, not before.
- Domain: transfer james-kendall.co.uk to Cloudflare Registrar rather than just repointing DNS. Free .co.uk transfer via IPS tag change at Squarespace, 60-day lock afterwards before it could move again.
- Full plain-language git/GitHub/Cloudflare/domain walkthrough written to `../GIT-GITHUB-SETUP.md`, with a timeline working back from the mid-September deadline.
- Next physical step: create GitHub account, then git init the repo (James can do the commands himself or have Claude run them in-session).

## Done — 5 July 2026, evening (poster system remake)

- Full remake on the **James Kendall Design System** (`1. Projects/Design System/`): paper/ink/signal-red, Anton display type, Archivo body, IBM Plex Mono metadata, Tinos captions, Permanent Marker scrawl. All self-hosted via @fontsource.
- v1 warm-white build backed up to `../site-v1-warm-white/` (source + its DESIGN-SPEC). DESIGN-SPEC.md rewritten as v2.
- Display toggle dropped (James, 5 July). `DisplayToggle.astro` stubbed — sandbox can't delete files; safe to remove manually.
- DS core components ported to `src/components/ds/`: Tag, Sticker, MetaLine, PosterCard, ButtonLink.
- Chrome: Anton wordmark left, bracketed mono nav right (locked IA), sticky hairline header; MetaLine footer.
- All pages remade per the DS website kit: poster hero home (headline over photo, multiply blend), PosterCard grids, project detail with tag row + image spread + enquire mailto, writing index with catalogue dates and static filter bar, about with bordered Get in touch box. RelatedStrip restyled.
- `src/lib/flags.ts` — `SHOW_DRAFTS = true`: drafts render tagged [DRAFT] so the design is visible pre-migration. **Flip to false before launch.**
- Placeholder images: nine real WOTY photographs in `public/images/woty/` (60MB PNGs, unoptimised — replaced by the sharp pipeline during content migration). Mapping in `src/lib/placeholders.ts`.
- Build verified: 17 pages, five font families in dist, tokens confirmed, zero toggle references.

## Done — 5 July 2026, afternoon (v1 design spike + build pass one — superseded by remake)

- Design spike decisions locked, recorded in `../DESIGN-SPEC.md`: Fraunces + Inter, warm white #faf7f2, four-mode display toggle (T cycles), Inter Black wordmark, related strip (within collection for v1), captions below images.
- `src/styles/tokens.css` — token single source of truth, mode palettes on `data-mode`.
- `src/styles/global.css` rewritten to spec (type scale, eyebrow/caption/standfirst classes, 1400px container, section-break rule).
- Fonts self-hosted: `@fontsource-variable/fraunces` + `@fontsource-variable/inter`, imported in BaseLayout. Google Fonts CDN gone from the real build.
- BaseLayout: pre-paint inline script restores display mode from localStorage, else system preferences (prefers-color-scheme, prefers-contrast).
- Nav rebuilt: three-part grid, links left, Inter 900 wordmark centre, icons + DisplayToggle right. Collapses to two rows under 720px.
- New components: `DisplayToggle.astro` (click or T, persists, syncs aria-label), `RelatedStrip.astro` (presentational, max three items, pages pass pre-selected same-collection siblings).
- Build verified clean: 5 pages, tokens/fonts/toggle all confirmed in dist output.

### Sandbox build note (Claude sessions only)

The Cowork sandbox cannot delete files created by earlier sessions, which breaks
`astro build` in place (vite cache, `.astro`, `dist` all delete files). Workaround:
rsync source to `/tmp/site-build` (excluding `node_modules`, `dist`, `.astro`),
symlink `node_modules`, build there:

    rsync -a --delete --exclude node_modules --exclude dist --exclude .astro --exclude .vite "$SITE/" /tmp/site-build/
    ln -sfn "$SITE/node_modules" /tmp/site-build/node_modules
    cd /tmp/site-build && VITE_CACHE_DIR=/tmp/vite-cache npm run build

`astro.config.mjs` also gained optional `VITE_CACHE_DIR` / `ASTRO_OUT_DIR` env
overrides. Both are unset on James's machine, so local builds are unaffected.

## Done — 17/18 April 2026 (scaffold)

- Local dev confirmed working (`npm run dev`, Astro serving on localhost). 17 April 2026.
- Astro 5 scaffold in `site/`
- Content collections configured: projects, commercial, writing
- Pages: home, about, projects (index + dynamic slug), commercial (index + dynamic slug), writing (index + dynamic slug)
- Nav + Footer components
- Placeholder CSS (cream bg, serif headings, generous whitespace)
- About page populated verbatim from `Bio.md` — biography, clients, exhibitions, awards, education, books
- 6 project stubs (all marked draft) with real titles, years and ordering
- 5 commercial category stubs (Portraits, Live Music, Bands, Events, Video)
- 1 writing stub: "All Under One Roof Raving" linked to Wasted On The Young
- Sitemap integration
- OG meta, canonical URLs, skip link, AA-friendly defaults

## Next

1. GitHub account + git init + Cloudflare Pages connection (see `../GIT-GITHUB-SETUP.md`) — start this week, deadline mid-September.
2. James reviews the remake in the browser (`npm install` then `npm run dev`).
3. Content migration from the Squarespace export; real images per project via sharp pipeline (`src/assets/images/<project-slug>/`), replace the WOTY placeholder mapping.
4. Wire up the writing filter bar (static tags currently).
5. Flip `SHOW_DRAFTS` to false as content goes live per section.
6. Domain transfer to Cloudflare Registrar — start early September, before the deadline, to allow for propagation.
7. Add Sveltia CMS admin panel once the core site is deployed.
8. Analytics choice at launch week: confirmed Cloudflare Web Analytics (free, already in the services plan).

## Decisions

- Framework: Astro 5 + content collections + glob loader.
- Hosting: Cloudflare Pages.
- Images: local, build-time optimisation via sharp. Originals kept outside the repo (`Photography Research/` folder).
- Nav order: Projects, Commercial, Writing, About. Matches current site, minus "+" glyphs.
- Commercial sub-nav: Portraits, Live Music, Bands, Events, Video (video stays inside Commercial).
- Writing: single bucket, no separate notebook.
- Contact: mailto only. jameswilliamkendall@gmail.com.
- Domain: james-kendall.co.uk stays.
- Analytics: deferred to launch week.
- Draft flag on everything until reviewed.

## Open questions

- Reference sites beyond Paul Graham Photography?
- Typography: current wordmark is close to Optima. Keep, or specify a replacement during design spike?
- CSV or script for Squarespace export conversion to Markdown — handle during content migration phase.
