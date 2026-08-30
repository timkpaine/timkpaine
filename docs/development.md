# Site development

The website is built with SvelteKit, Vite, and Tailwind CSS. SvelteKit prerenders static files for
GitHub Pages.

## Local development

Requires Node.js 22 or newer.

```bash
pnpm install
pnpm dev --open
```

Quality checks and automatic formatting:

```bash
pnpm check
pnpm lint
pnpm fix
pnpm test
```

Production preview:

```bash
pnpm build
pnpm preview
```

## Structure

- `src/routes/` contains site pages.
- `src/lib/data/site.ts` contains organization, talk, and experience content.
- `src/lib/posts.ts` indexes posts and is the single source for the index, feed, and sitemap.
- `plugins/` holds the build-time markdown extensions described under Writing posts.
- `static/talks/` contains legacy slide decks and demos. Its paths are intentionally preserved.
- `static/static/`, `static/rsc/`, and `static/.well-known/` preserve existing public URLs.

## Writing posts

Each post is a directory under `src/routes/writing/` holding a `+page.svx` file, with its images
alongside it. The directory name becomes the URL. `src/routes/writing/example-post/` is a permanent
draft that demonstrates every feature and backs the tests in `tests/behavior/writing.spec.ts`.

```
src/routes/writing/my-post/
  +page.svx
  diagram.png
```

Frontmatter drives the page, the index, the feed, and the sitemap:

```yaml
---
title: Post title
description: One or two sentences, used for meta description and the index.
date: 2026-09-01
tags: [optional, list]
draft: true
---
```

`title`, `description`, and `date` are required. `updated` adds `dateModified` and the sitemap
`lastmod`; `image` overrides the social card; `draft` hides the post from the index, the feed, and the
sitemap while leaving it reachable at its URL with a `noindex` tag.

Ordinary markdown works. A few things are wired up on top of it:

- **Images.** Relative markdown images become responsive AVIF/WebP with intrinsic dimensions. Import
  with `?enhanced` and use `Figure` when a caption or a wider layout is wanted. Do not hand-write
  `enhanced:img` tags — the markdown form and `Figure` cover both cases.
- **Footnotes.** `[^name]` in prose with `[^name]: text` at the end. Markers are renumbered to match
  the list, so names can be meaningful and reordering is safe.
- **Headings.** `h2`–`h4` get ids and anchor links automatically.
- **Code.** Fenced blocks are highlighted with Prism and are keyboard scrollable.

Social cards are generated with the browser Playwright already installs:

```bash
node scripts/og.mjs           # default card -> static/og.png
node scripts/og.mjs --posts   # per-post cards -> static/og/<slug>.png
```

Point a post at its own card with `image: /og/<slug>.png`.

## Deployment

Pushes to `main` run checks, build the static site, and deploy it through GitHub Pages. The repository
must use **GitHub Actions** as its Pages source. `static/CNAME` preserves the `tim.paine.nyc` custom
domain.
