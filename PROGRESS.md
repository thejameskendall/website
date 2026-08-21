# Progress

Running log of what's done, what's next, decisions made. Updated each session.

## Done — 21 August 2026

- Arrow-key navigation on both carousels (project galleries, homepage hero) now listens on the whole document instead of just the carousel element — works the moment you land on the page, no need to click into the carousel first. Skips while focus is in a form field. Build tested, confirmed present in both the homepage and a project page's bundled script.

- First attempt at the "wide browser crops the bottom off images" problem was an aspect-ratio-capped `object-fit: cover` box. James tried it and didn't want cropping at all, at any width. Replaced with `object-fit: contain` everywhere images sit in a fixed box (homepage hero, project carousel, project placeholder plate) — the whole photo is always visible, letterboxed with `background: var(--paper-1)` filling any gap so it blends with the page rather than showing a hard edge.
- That fix introduced a new problem: captions, controls and the homepage tag were still positioned against the old fixed box, so once `contain` could make the visible image narrower than its box, the text no longer lined up with it. Restructured both carousels so the box shrink-wraps to the image's actual rendered size instead of a fixed ratio (`width: auto; height: auto; max-height: ...`), centred as a group, with the caption moved inside each slide so it shares the same left edge as the photo above it. Homepage hero tag is now positioned relative to the shrink-wrapped image link, not the full-bleed frame, so it sits on the actual photo corner. Project carousel controls are now a compact centred cluster rather than a full-width bar. Caught and fixed a real bug along the way: adding `display: flex` directly on `.hero-slide`/`.carousel-slide` would have overridden the browser's own `[hidden] { display: none }` rule (author CSS beats the user-agent stylesheet regardless of specificity), which would have shown every slide stacked at once — scoped the flex rules to `:not([hidden])` instead. Build tested, confirmed only one slide unhidden at a time and all captions present per-slide.
- Rehosted the 20 downloadable images from `Website Content/WRITING PAGE IMAGES/` into `public/images/writing/<slug>/`, replacing the `<!-- TODO -->` Squarespace hotlinks with local `.webp` paths across the migrated articles. `my-dissertation.md` still hotlinks to Squarespace (no screenshot supplied yet — see below).
- Set all 23 Writing articles from `draft: true` to `draft: false` (James's "set them all to published" call).
- Added `coverImage` to the `writing` schema and backfilled it on 20/23 articles (first image found in the body). `abi-wade-interview.md`, `aroe-interview.md`, `orbital-interview.md` have no images at all, so no `coverImage`.
- Made the Writing index page visual: each list entry now shows a 120px thumbnail (`entry-thumb`) next to the title/summary, pulled from `coverImage`. The 3 image-less articles get a plain hairline-bordered placeholder box instead of a broken image. Build tested clean (39 pages, no schema errors).
- Explained the GitHub 500 "unicorn" error James hit generating a PAT — confirmed via search as a genuine GitHub-wide outage that day, not a config issue. No action needed, just retry later.

- Replaced the placeholder `my-dissertation.md` with the real essay content ("The Rejection, & Return, of Beauty in Representations of Ukraine"), pasted from James as a Squarespace code block. Retitled the piece (was "My Dissertation"), stripped the duplicate h1/byline (the page template already renders the title), converted all 30 footnote hover-tooltips into plain superscript anchors linking to a Notes section, kept the Notes and collapsible Bibliography as native HTML (`<ol>` / `<details>`), and rebuilt all of it with DS tokens (Anton/Archivo/Plex Mono, signal-red accent, hairline borders) instead of the original Squarespace CSS (Georgia serif, hardcoded hex, JS hover tooltips — the JS was also broken, empty forEach callbacks). No cover image supplied for this one, so it shows the same hairline placeholder box as the 3 other image-less articles. Build tested clean.

- Fixed My Dissertation's date to 2022-09-01 (James confirmed written September 2022).
- Rebuilt the homepage hero as a full-bleed autoplaying carousel — one slide per project + one per commercial section (11 total, interleaved), each tagged `[PROJECT]`/`[COMMERCIAL]` with its title and linking out to that section. Autoplay every 5.5s, permanently stops on first manual prev/next/arrow-key use, skips entirely if `prefers-reduced-motion`. Name/tagline sit in a flat dark panel overlaid top-right (no gradients/blur, per the DS's flat-poster rule); each slide's tag is a flat paper sticker bottom-left. Old poster hero (title lockup, single fixed image, NEW sticker) is gone; the standfirst paragraph and project grid stay below as before. Uses the same real-image-then-placeholder fallback the grid already used, so most slides are still Wasted On The Young placeholder crops until the other 5 projects and all 5 commercial sections get real photos.

- Removed the homepage carousel's name/tagline overlay panel (James wanted the image itself unobstructed). Slides now show image + tag only, controls unchanged.
- My Dissertation: footnote numbers and their ↩ back-links now have `scroll-margin-top: 90px` so jumping to them lands below the sticky nav instead of underneath it. Bibliography changed from a click-to-expand `<details>` to a permanently visible section (same heading style as Notes, still with a hairline top border for separation).

- Built out Unmade Beds with real content, same pattern as Wasted On The Young: 13 plates copied from `Website Content/Unmade Beds/` into `src/assets/images/unmade-beds/`, added to the `images[]` gallery (auto-carousel), captions following WOTY's "Untitled NN, [project], [years], 29mm x 38mm, Giclée print on [paper]" format with Hahnemühle Photorag per James's text. Summary and body copy taken from James's supplied text. No exhibition views or documents for this one yet. Left `draft: true`, matching WOTY's own still-draft state. Build tested clean, real photos confirmed rendering (no placeholder sticker).

### Still open

- `coverImage` isn't in `public/admin/config.yml` yet, so it's not editable via the CMS UI. Add it once James wants to swap thumbnails himself.
- Writing filter bar (type/publication tags) is static — no click-to-filter wired up yet.
- Homepage carousel will look much better once real photos exist for the other 4 remaining projects and any commercial section — Unmade Beds is now real, but Best Before, First Dance, Made Beds and Much Like Unrequited Love are still placeholder crops of Wasted On The Young.

## Done — 17 August 2026 (Squarespace Writing migration)

- James uploaded a fresh export (`Squarespace-Wordpress-Export-08-17-2026.xml`). Found three content buckets inside: `writing` (23 items, matches the site's IA directly), `blog` (42 older items, different old URL, not currently part of the IA), `blog-forte` (4 items + several `-forte` pages, unrelated leftover from a different old project).
- James's call: migrate `writing` only, all 22 (excluding the one already hand-migrated) come in as `draft: true` regardless of their old Squarespace status, for review via the CMS at his own pace.
- Built `scripts/migrate-writing.py` — parses the WXR export properly (XML-aware, not regex), converts Squarespace's HTML to clean markdown, writes frontmatter matching the schema. Reusable if the `blog` bucket ever gets migrated too.
- Cleaned up three slugs that inherited a literal `nbsp` artifact from Squarespace (`caroline-lucas-interviewnbsp` → `caroline-lucas-interview`, same for the-wytches and traams).
- Build verified clean: 39 pages, zero schema errors.

### Known gap — needs resolving before mid-September

All 20 images referenced in the migrated articles are still hotlinked to `images.squarespace-cdn.com` — this sandbox can't reach that domain (network egress restrictions), so downloads failed for every one. Each is marked with a `<!-- TODO -->` comment in its markdown file. **These will break once the Squarespace subscription lapses.** Options: James downloads them via his own browser (not sandboxed) and drops them somewhere I can pick up, or we revisit closer to the domain cutover. Listed here so it doesn't get missed.

### Also flagged, not fixed

- `my-dissertation.md` migrated with almost no body — the original Squarespace post was just a cover image, likely meant to link out to an actual dissertation PDF that was never captured in the export. Same pattern as the Research Dossier PDF link on Wasted On The Young; James has the actual file if he wants it added the same way.
- Several articles' `date` reflects when they were added to Squarespace, not necessarily first publication (e.g. Caroline Lucas interview body text says "AUGUST 19, 2013" but `wp:post_date` was 2018). Left as-is; worth a look if publication dates matter for these.
- `summary` fields are auto-generated from Squarespace excerpts and occasionally read a little rough (missing space where an HTML tag was stripped). Worth a skim via the CMS rather than trusting them as final.

## Done — 15 August 2026, later (first CMS-triggered build break, fixed)

- James used the CMS for real: edited "All Under One Roof Raving" with the full essay body and an inline image. Confirmed the CMS → GitHub → Cloudflare pipeline works exactly as designed, no extra glue needed — the Writing page already reads the same files the CMS edits.
- Site went stale for ~15 minutes. Cause: Sveltia writes `''` (empty string) for a blank optional field rather than omitting it. `externalUrl: z.string().url().optional()` rejects `''` outright, so the build crashed at the content-sync step the moment External URL was left blank in the CMS. Site stayed on the last successful deploy the whole time — nothing was down, just stuck.
- Diagnosed via Cloudflare's Deployments tab (build log showed `InvalidContentEntryDataError... externalUrl: Invalid url`), confirmed the exact cause, fixed the schema to treat `''` as unset before validating.
- Also: James's GitHub commit (via CMS) went straight to `origin/main`, bypassing his local GitHub Desktop clone entirely — different from every previous change, which went local commit → GitHub Desktop push. Had to `git fetch` + fast-forward pull before making the fix, to avoid diverging history.
- Fix committed locally, needs a GitHub Desktop push (no stored push token in this session, by design).
- Worth watching: any other CMS-editable field with `.url()` or similar strict validation could hit the same failure mode. Only `externalUrl` exists today; revisit if more fields like it get added.

## Done — 15 August 2026 (Sveltia CMS for Writing)

- Live at `/admin` once pushed and deployed. Sveltia CMS, git-based, free, no extra hosting.
- Auth: personal access token (checked Sveltia's own docs — for a single-user GitHub backend, this is their recommended method, no Cloudflare Worker or OAuth app needed. Originally asked for the Worker route; corrected course once the docs made clear it was unnecessary complexity for one user).
- Writing collection only for v1: title, date, type, publication, externalUrl, relatedProject, summary, draft, body — matches `src/content/config.ts` exactly.
- Projects/Commercial not in the CMS yet — deliberately held back. Those files have nested image galleries that need careful field mapping first, to avoid the CMS overwriting that data on save. Add later, one collection at a time, same pattern.
- CMS-uploaded images go to `public/images/writing` (plain static files, not through the sharp pipeline). Fine for inline article images, not for the same treatment as project photography.
- Committed locally, not yet pushed.

### To log in

1. Push via GitHub Desktop, wait for Cloudflare to redeploy.
2. Go to `<site>/admin`.
3. Click "Sign In with Token". It links straight to GitHub's token creation page with the right permissions pre-selected.
4. Generate the token, paste it back into the CMS prompt.

## Done — 11 August 2026 (Research Dossier PDF link)

- New reusable schema field: `documents[]` (label + url) on the projects collection, for supplementary PDFs (dossiers, press packs). Served as static files from `public/documents/<slug>/`.
- WOTY's Research Dossier PDF (15MB) added, linked from the Related Writing section, opens in a new tab.
- Committed locally, not yet pushed.

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
