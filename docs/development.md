# Site development

The website is built with SvelteKit, Vite, and Tailwind CSS. SvelteKit prerenders static files for
GitHub Pages.

## Local development

Requires Node.js 22 or newer.

```bash
pnpm install
pnpm dev --open
```

Production preview:

```bash
pnpm build
pnpm preview
```

## Structure

- `src/routes/` contains site pages.
- `src/lib/data/site.ts` contains organization, talk, and experience content.
- `public/talks/` contains legacy slide decks and demos. Its paths are intentionally preserved.
- `public/static/`, `public/rsc/`, and `public/.well-known/` preserve existing public URLs.

## Deployment

Pushes to `main` run checks, build the static site, and deploy it through GitHub Pages. The repository
must use **GitHub Actions** as its Pages source. `public/CNAME` preserves the `tim.paine.nyc` custom
domain.
