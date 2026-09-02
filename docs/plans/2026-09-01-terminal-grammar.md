# Terminal Grammar Implementation Plan — tim.paine.nyc

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild tim.paine.nyc as a personal record — résumé, talks, writing — on the terminal grammar shipped by `@timkpaine/ui`, removing the product-landing-page structure and the generated copy.

**Architecture:** Every list becomes a `DataTable` from the UI package. Three page-level sections replace the hero, org grid, inverted talks band, and about section. `prose.css` is retargeted to the new tokens, including an explicit syntax palette that replaces the `color-mix` derivations from the deleted accent.

**Tech Stack:** SvelteKit 2 with `adapter-static`, Svelte 5 runes, MDsveX (`.svx`), Tailwind 4, Playwright, pnpm workspace linking `@timkpaine/ui`.

**Spec:** `../ui/docs/specs/2026-09-01-terminal-grammar-design.md` (in the `ui` repo)

**Prerequisite:** The `ui` plan (`ui/docs/plans/2026-09-01-terminal-grammar.md`) must be complete, built, **and reinstalled here**.

`package.json` declares `"@timkpaine/ui": "file:../../ui"`. pnpm resolves `file:`
for a directory by **copying** it into `node_modules/.pnpm`, not by symlinking
the working tree. Editing the `ui` source therefore has no effect on this repo
until both of these run:

```bash
pnpm --dir ../../ui build
pnpm install --force
```

Run that pair before Task 1, and again after any later change to `ui`. If a
symbol that exists in the `ui` source is reported missing here, this is
why — the copy is stale.

Because `file:../../ui` hardcodes a relative path, **do not** move either repo
into a git worktree; it breaks the dependency. Both repos are already on
non-default branches, which is the isolation that matters.

## Global Constraints

- Do **not** change `"version"` in `package.json`.
- Do **not** stage `static/talks/assets/other/gans.pdf` or `static/talks/assets/other/xgboost.pdf`. They are modified in the working tree, pre-existing, and unrelated to this work.
- Do **not** touch anything under `static/talks/` — the slide decks are out of scope.
- Do **not** modify `svelte.config.js`, `vite.config.ts`, the `plugins/` directory, or `.copier-answers.yaml`.
- Removed UI exports — using any of these is an error: `LiveSignal`, `SystemClock`. Removed `Nav` props: `ctaHref`, `ctaLabel`. Removed `BrandMark` prop: `size`.
- Removed tokens — any surviving reference is a bug: `--tp-color-paper`, `--tp-color-ink`, `--tp-color-muted`, `--tp-color-line`, `--tp-color-accent`, `--tp-color-accent-ink`, `--tp-color-grid-line`, `--tp-motion-reveal`.
- Removed Tailwind utilities: `bg-accent`, `text-accent`, `ring-ink`, `border-line`, `text-muted`, `bg-ink`, `text-paper`. Replacements: `border-rule`, `text-fg-dim`, `bg-fg`, `text-bg`.
- Removed CSS classes: `eyebrow`, `link-line`, `neon-hover`, `neon-hover-muted`, `reveal`.
- No `↗` characters. External links show the host via `<span class="tp-host">`.
- No numeric section counters (`01 /`, `02 /`). Table row indices are fine.
- Copy is plain and specific. No promotional register, no calls to action.
- Commit messages use simple imperative style. No conventional-commit prefixes. No `Co-Authored-By` trailers.

---

### Task 1: Wire up the new stylesheet entry points

**Files:**

- Modify: `src/app.css`
- Modify: `src/routes/+layout.svelte`

**Interfaces:**

- Consumes: `@timkpaine/ui/fonts.css`, `tokens.css`, `tailwind.css`, `base.css`.
- Produces: a page whose base typography is Spline Sans Mono.

- [ ] **Step 1: Add the font import**

`src/app.css` becomes:

```css
@import 'tailwindcss';
@import '@timkpaine/ui/fonts.css';
@import '@timkpaine/ui/tokens.css';
@import '@timkpaine/ui/tailwind.css';
@import '@timkpaine/ui/base.css';
@import './prose.css';
```

- [ ] **Step 2: Drop the deleted components from the layout**

`src/routes/+layout.svelte` becomes:

```svelte
<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { Footer, Nav } from '@timkpaine/ui';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="alternate" type="application/rss+xml" title="Tim Paine — Writing" href="/writing/rss.xml" />
</svelte:head>

<Nav currentPath={page.url.pathname} />
<main>{@render children()}</main>
<Footer />
```

`SystemClock` is gone, and with it the `data-clock-invert` contract.

- [ ] **Step 3: Confirm the font actually loads**

```bash
pnpm dev
```

Open the site. In devtools, confirm `Spline Sans Mono` appears under Network → Font and that body text is monospace. A silent fallback to Menlo means the `@font-face` URLs did not resolve — check that `ui` was built (`pnpm --filter @timkpaine/ui build`) and that `dist/styles/fonts/` contains the `.woff2` files. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/app.css src/routes/+layout.svelte
git commit -m "Load the terminal grammar stylesheets and drop the system clock"
```

---

### Task 2: Retarget prose.css

**Files:**

- Modify: `src/prose.css`

**Interfaces:**

- Consumes: tokens from the UI package.
- Produces: readable longform in both themes, with a syntax palette that passes AA.

This fixes a live bug: syntax keywords currently render `#c8ff35` on the light ground at **1.03:1** — invisible.

Correction: the a11y audit here _did_ already cover `/writing/example-post/`, which contains a `ts` fence. Injecting the old styling makes axe report a serious color-contrast violation, so coverage was not the gap. Why the suite was green beforehand was not established — do not assume the audit is a sufficient guard on its own. The token-level contrast suite in `@timkpaine/ui` is the reliable check.

- [ ] **Step 1: Replace every removed token reference**

```bash
grep -n "tp-color-" src/prose.css
```

Apply this mapping across the whole file:

| Old                | New           |
| ------------------ | ------------- |
| `--tp-color-ink`   | `--tp-fg`     |
| `--tp-color-muted` | `--tp-fg-dim` |
| `--tp-color-line`  | `--tp-rule`   |
| `--tp-color-paper` | `--tp-bg`     |

- [ ] **Step 2: Set prose in the sans stack**

Monospace at reading length is worse for the build logs. Add to the `.prose` rule:

```css
.prose {
  color: var(--tp-fg);
  font-family: var(--tp-font-sans);
  font-size: 1.0625rem;
  line-height: 1.75;
  max-width: 42rem;
}
```

Code keeps the mono face:

```css
.prose code,
.prose pre {
  font-family: var(--tp-font-mono);
}

.prose pre {
  padding: 1rem;
  overflow-x: auto;
  background: var(--tp-bg-code);
}
```

- [ ] **Step 3: Replace the three accent-derived rules**

The link underline (line ~58), the blockquote border (line ~83), and the focus outline (line ~99) all referenced the deleted accent:

```css
.prose a:hover {
  text-decoration-color: var(--tp-fg);
}

.prose blockquote {
  border-left: 2px solid var(--tp-rule);
}

.prose :focus-visible {
  outline: var(--tp-focus-width) solid var(--tp-fg);
}
```

- [ ] **Step 4: Replace the syntax palette**

Delete the three `color-mix` token rules at the end of the file and use explicit values. The mixes are what made the failure invisible.

```css
/* Syntax tokens. Values verified against --tp-bg-code in both themes; see
   the tokens.test.ts contrast suite in @timkpaine/ui. */
.prose .token.comment,
.prose .token.prolog,
.prose .token.doctype,
.prose .token.cdata {
  color: var(--tp-fg-dim);
  font-style: italic;
}

.prose .token.punctuation,
.prose .token.operator {
  color: var(--tp-fg-dim);
}

.prose .token.keyword,
.prose .token.selector,
.prose .token.important,
.prose .token.atrule {
  color: var(--tp-syn-keyword);
  font-weight: 600;
}

.prose .token.string,
.prose .token.char,
.prose .token.attr-value,
.prose .token.regex {
  color: var(--tp-syn-string);
}

.prose .token.function,
.prose .token.class-name {
  font-weight: 600;
}

.prose .token.number,
.prose .token.boolean,
.prose .token.constant,
.prose .token.symbol {
  color: var(--tp-syn-number);
}
```

- [ ] **Step 5: Verify nothing stale remains**

```bash
grep -n "tp-color-\|color-mix" src/prose.css || echo "clean"
```

Expected: `clean`.

- [ ] **Step 6: Look at a real post in both themes**

```bash
pnpm dev
```

Open `/writing/1-imac/`. Toggle light and dark. Confirm body text is proportional, code blocks are monospace on the raised ground, and keywords are clearly legible in **light** mode — that is the bug being fixed. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/prose.css
git commit -m "Retarget prose styles and fix unreadable syntax keywords"
```

---

### Task 3: Reshape the site data

**Files:**

- Modify: `src/lib/data/site.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: `organizations: readonly string[]`, plus unchanged `talks` and `experience`. Every page below reads from here.

- [ ] **Step 1: Replace the organizations export**

Twelve records with avatars and descriptions become a plain list. Delete the whole `organizations` array and replace it:

```ts
/** Open-source accounts, listed inline rather than as a card grid. */
export const organizations = [
  'JupyterLab',
  'conda-forge',
  'Perspective',
  'nbprint',
  'dau.',
  'airflow-laminar',
  'python-project-templates',
  'FINOS',
  'Point72',
  'JPMorganChase',
  '1kbgz'
] as const;
```

- [ ] **Step 2: Leave `talks` and `experience` alone**

Both already have the right shape. Do not edit them.

- [ ] **Step 3: Find every consumer of the old shape**

```bash
grep -rn "organization\." src/ || echo "clean"
```

Expected: hits in `src/routes/+page.svelte` only, fixed in Task 4.

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/site.ts
git commit -m "Reduce the organizations list to plain names"
```

---

### Task 4: Rebuild the home page

**Files:**

- Modify: `src/routes/+page.svelte` (full rewrite)

**Interfaces:**

- Consumes: `DataTable` and `Column`/`Row` types from `@timkpaine/ui`; `experience`, `talks`, `organizations` from `$lib/data/site`; `visiblePosts` from `$lib/posts`.
- Produces: the site's index.

Deleted here: the `clamp(4.5rem, 11vw, 10.5rem)` "Hello." hero, the `LiveSignal` block, the entire Open-Meteo fetch and its `onMount`/`AbortController`, the twelve-card organizations grid, the inverted "Ideas." talks band with `data-clock-invert`, and the "Research + Product." about section.

- [ ] **Step 1: Rewrite the file**

```svelte
<script lang="ts">
  import { DataTable, type Column, type Row } from '@timkpaine/ui';
  import Seo from '$lib/components/Seo.svelte';
  import { experience, organizations, talks } from '$lib/data/site';
  import { formatDate } from '$lib/dates';
  import { visiblePosts } from '$lib/posts';

  const roleColumns: Column[] = [
    { key: 'company', label: 'Organization' },
    { key: 'years', label: 'Period', sortable: true },
    { key: 'role', label: 'Role' }
  ];

  const talkColumns: Column[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'event', label: 'Venue', sortable: true }
  ];

  const writingColumns: Column[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'date', label: 'Date', sortable: true }
  ];

  const roleRows: Row[] = experience.map((item) => ({ ...item }));

  const talkRows: Row[] = talks.slice(0, 5).map((talk) => ({
    title: talk.title,
    year: talk.year,
    event: talk.event
  }));

  const writingRows: Row[] = visiblePosts.map((post) => ({
    title: post.title,
    date: formatDate(post.date),
    url: post.url
  }));
</script>

<Seo
  title="Tim Paine"
  description="Tim Paine is a software engineer in New York working on data systems, visualization, and computing hardware."
/>

<section class="page">
  <header class="intro">
    <h1>Tim Paine</h1>
    <p>Software engineer in New York. I work on data systems, visualization, and the hardware underneath them.</p>
  </header>

  <DataTable caption="Résumé" meta="{roleRows.length} rows" columns={roleColumns} rows={roleRows} />

  <DataTable
    caption="Talks"
    meta="{talks.length} total, {talkRows.length} shown"
    columns={talkColumns}
    rows={talkRows}
  />
  <p class="more"><a href="/talks/">All {talks.length} talks</a></p>

  {#if writingRows.length}
    <DataTable
      caption="Writing"
      meta="{writingRows.length} {writingRows.length === 1 ? 'post' : 'posts'}"
      columns={writingColumns}
      rows={writingRows}
      href={(row) => String(row.url)}
    />
    <p class="more"><a href="/writing/">All writing</a></p>
  {/if}
</section>

<style>
  .page {
    display: grid;
    gap: 2.25rem;
    width: min(calc(100% - 2.5rem), var(--tp-content-width));
    margin: 0 auto;
    padding: 3rem 0 5rem;
  }

  .intro {
    display: grid;
    gap: 0.75rem;
    max-width: 62ch;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  .intro p {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .more {
    margin: -1.5rem 0 0;
    font-size: 0.75rem;
  }

  a {
    color: inherit;
    text-underline-offset: 0.25em;
  }

  @media (min-width: 640px) {
    .page {
      width: min(calc(100% - 4rem), var(--tp-content-width));
    }
  }

  @media (min-width: 1024px) {
    .page {
      width: min(calc(100% - 6rem), var(--tp-content-width));
    }
  }
</style>
```

- [ ] **Step 2: Confirm the weather code is gone**

```bash
grep -n "open-meteo\|temperature\|AbortController\|onMount" src/routes/+page.svelte || echo "clean"
```

Expected: `clean`.

- [ ] **Step 3: Type-check**

```bash
pnpm check
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "Rebuild the index as three tables"
```

---

### Task 5: Rebuild the talks page

**Files:**

- Modify: `src/routes/talks/+page.svelte` (full rewrite)

**Interfaces:**

- Consumes: `talks` from `$lib/data/site`, `DataTable`.
- Produces: the full talks archive.

Deleted: the `Ideas.` display headline, the per-item `01`/`02` counter, and every `↗`.

- [ ] **Step 1: Rewrite the file**

Media links become a real column. Each talk exposes some subset of `recording`, `slides`, and `source`, so the cell is built per row.

```svelte
<script lang="ts">
  import { DataTable, type Column, type Row } from '@timkpaine/ui';
  import Seo from '$lib/components/Seo.svelte';
  import { talks } from '$lib/data/site';

  const columns: Column[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'event', label: 'Venue', sortable: true },
    { key: 'description', label: 'Summary' }
  ];

  const rows: Row[] = talks.map((talk) => ({ ...talk }));

  /** The media links for one talk, in a stable order. */
  function media(talk: (typeof talks)[number]): { href: string; label: string }[] {
    const out: { href: string; label: string }[] = [];
    if ('recording' in talk) out.push({ href: talk.recording, label: 'video' });
    if ('slides' in talk) out.push({ href: talk.slides, label: 'slides' });
    if ('source' in talk) out.push({ href: talk.source, label: 'source' });
    return out;
  }
</script>

<Seo
  title="Talks — Tim Paine"
  description="Conference talks by Tim Paine on Jupyter, data visualization, open source, and specialized computing."
/>

<section class="page">
  <header>
    <h1>Talks</h1>
    <p class="tp-dim">{talks.length} talks, 2020 to 2025.</p>
  </header>

  <DataTable caption="Archive" meta="{talks.length} rows" {columns} {rows} searchable />

  <div class="media">
    <h2>Slides and recordings</h2>
    <ul>
      {#each talks as talk (talk.title)}
        <li>
          <span class="title">{talk.title}</span>
          {#each media(talk) as link (link.href)}
            <a class={link.label} href={link.href}>{link.label}</a>
          {/each}
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .page {
    display: grid;
    gap: 2.25rem;
    width: min(calc(100% - 2.5rem), var(--tp-content-width));
    margin: 0 auto;
    padding: 3rem 0 5rem;
  }

  h1 {
    margin: 0 0 0.4rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  header p {
    margin: 0;
    font-size: 0.8rem;
  }

  h2 {
    margin: 0 0 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  ul {
    display: grid;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.3rem 0;
    border-bottom: var(--tp-border-width) solid var(--tp-rule);
    font-size: 0.8rem;
  }

  .title {
    flex: 1 1 24ch;
  }

  a {
    color: var(--tp-fg);
    text-decoration: none;
    border-bottom: 1px solid currentcolor;
  }

  a.video {
    color: var(--tp-video);
  }

  a.slides,
  a.source {
    color: var(--tp-slides);
  }

  @media (min-width: 640px) {
    .page {
      width: min(calc(100% - 4rem), var(--tp-content-width));
    }
  }

  @media (min-width: 1024px) {
    .page {
      width: min(calc(100% - 6rem), var(--tp-content-width));
    }
  }
</style>
```

- [ ] **Step 2: Type-check**

```bash
pnpm check
```

Expected: no errors. If TypeScript rejects `talk.recording` inside the `in` narrowing, the `talks` array is `as const` with heterogeneous members — cast the parameter to `Record<string, string>` inside `media` rather than widening the data.

- [ ] **Step 3: Commit**

```bash
git add src/routes/talks/+page.svelte
git commit -m "Rebuild the talks page as a searchable table"
```

---

### Task 6: Rebuild the writing index

**Files:**

- Modify: `src/routes/writing/+page.svelte` (full rewrite)

**Interfaces:**

- Consumes: `visiblePosts` from `$lib/posts`, `formatDate`/`toIsoDate` from `$lib/dates`, `DataTable`.
- Produces: the writing index. Keeps the RSS link and the draft marker.

Deleted: the `Thoughts` display headline, `First dispatch in progress`, the accent dot, and the `neon-hover` rows.

- [ ] **Step 1: Rewrite the file**

```svelte
<script lang="ts">
  import { DataTable, type Column, type Row } from '@timkpaine/ui';
  import Seo from '$lib/components/Seo.svelte';
  import { formatDate } from '$lib/dates';
  import { visiblePosts } from '$lib/posts';

  const columns: Column[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'description', label: 'Summary' }
  ];

  const rows: Row[] = visiblePosts.map((post) => ({
    title: post.draft ? `${post.title} (draft)` : post.title,
    date: formatDate(post.date),
    description: post.description,
    url: post.url
  }));
</script>

<Seo
  title="Writing — Tim Paine"
  description="Notes by Tim Paine on software, open source, data systems, and hobby projects."
/>

<section class="page">
  <header>
    <h1>Writing</h1>
    <p class="tp-dim">
      Notes and hobby projects.
      <a href="/writing/rss.xml">RSS</a>
    </p>
  </header>

  {#if rows.length}
    <DataTable
      caption="Posts"
      meta="{rows.length} {rows.length === 1 ? 'post' : 'posts'}"
      {columns}
      {rows}
      searchable
      href={(row) => String(row.url)}
    />
  {:else}
    <p class="empty">No posts yet.</p>
  {/if}
</section>

<style>
  .page {
    display: grid;
    gap: 2.25rem;
    width: min(calc(100% - 2.5rem), var(--tp-content-width));
    min-height: 60vh;
    margin: 0 auto;
    padding: 3rem 0 5rem;
  }

  h1 {
    margin: 0 0 0.4rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  header p {
    margin: 0;
    font-size: 0.8rem;
  }

  .empty {
    margin: 0;
    padding-top: 1rem;
    border-top: var(--tp-border-width) solid var(--tp-rule);
    color: var(--tp-fg-dim);
    font-size: 0.8rem;
  }

  a {
    color: inherit;
    text-underline-offset: 0.25em;
  }

  @media (min-width: 640px) {
    .page {
      width: min(calc(100% - 4rem), var(--tp-content-width));
    }
  }

  @media (min-width: 1024px) {
    .page {
      width: min(calc(100% - 6rem), var(--tp-content-width));
    }
  }
</style>
```

- [ ] **Step 2: Verify drafts still appear in dev**

```bash
pnpm dev
```

`visiblePosts` includes drafts while developing, so a draft post must show with `(draft)` appended. Stop the server.

- [ ] **Step 3: Commit**

```bash
git add src/routes/writing/+page.svelte
git commit -m "Rebuild the writing index as a table"
```

---

### Task 7: Restyle the post layout and the error page

**Files:**

- Modify: `src/routes/+error.svelte` (full rewrite)
- Modify: `src/lib/components/PostLayout.svelte:57-105`

**Interfaces:**

- Consumes: tokens; `TagIcon`, `Seo`, `$lib/dates` all unchanged.
- Produces: the article shell for every `.svx` post.

The "Written by a human" badge stays. Given what this redesign is about, it earns its place.

- [ ] **Step 1: Rewrite the error page**

```svelte
<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} — Tim Paine</title>
</svelte:head>

<section>
  <h1>{page.status}</h1>
  <p>{page.error?.message ?? 'Page not found.'}</p>
  <p><a href="/">Index</a></p>
</section>

<style>
  section {
    display: grid;
    gap: 0.6rem;
    width: min(calc(100% - 2.5rem), var(--tp-content-width));
    min-height: 50vh;
    align-content: center;
    margin: 0 auto;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  p {
    margin: 0;
    color: var(--tp-fg-dim);
    font-size: 0.85rem;
  }

  a {
    color: var(--tp-fg);
  }
</style>
```

- [ ] **Step 2: Replace the post header markup**

In `PostLayout.svelte`, replace the `<article>` opening through the end of `</header>`. The `<script>` block, the `Seo` call, the JSON-LD, and the `.prose` render are unchanged.

```svelte
<article class="post">
  <header>
    <p class="crumb tp-dim">
      <a href="/writing/">Writing</a>
      <span aria-hidden="true">/</span>
      <time datetime={toIsoDate(date)}>{formatDate(date)}</time>
      {#if draft}<span class="draft">draft</span>{/if}
    </p>

    <h1>{title}</h1>
    <p class="description">{description}</p>

    <ul class="tags">
      {#each tags as tag (tag)}
        <li><TagIcon {tag} />{tag}</li>
      {/each}
      <li data-testid="human-written">written by a human</li>
    </ul>
  </header>
```

- [ ] **Step 3: Replace the footer link**

```svelte
  <footer>
    <a href="/writing/">All writing</a>
  </footer>
</article>
```

- [ ] **Step 4: Add the styles**

Append a `<style>` block to `PostLayout.svelte`:

```svelte
<style>
  .post {
    width: min(calc(100% - 2.5rem), 68rem);
    margin: 0 auto;
    padding: 3rem 0 6rem;
  }

  header {
    padding-bottom: 1.75rem;
    border-bottom: var(--tp-border-width) solid var(--tp-rule);
  }

  .crumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 1rem;
    font-size: 0.72rem;
  }

  .draft {
    padding: 0 0.35rem;
    color: var(--tp-on-select-fg);
    background: var(--tp-select);
  }

  h1 {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.15;
    max-width: 30ch;
  }

  .description {
    margin: 0.8rem 0 0;
    max-width: 60ch;
    color: var(--tp-fg-dim);
    font-family: var(--tp-font-sans);
    font-size: 1rem;
    line-height: 1.6;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1.25rem 0 0;
    padding: 0;
    list-style: none;
  }

  .tags li {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.1rem 0.4rem;
    border: var(--tp-border-width) solid var(--tp-rule);
    color: var(--tp-fg-dim);
    font-size: 0.7rem;
  }

  footer {
    margin-top: 3rem;
    padding-top: 1.25rem;
    border-top: var(--tp-border-width) solid var(--tp-rule);
    font-size: 0.8rem;
  }

  a {
    color: inherit;
  }
</style>
```

- [ ] **Step 5: Confirm the badge test hook survives**

```bash
grep -n 'data-testid="human-written"' src/lib/components/PostLayout.svelte
```

Expected: one hit. Existing tests depend on it.

- [ ] **Step 6: Commit**

```bash
git add src/routes/+error.svelte src/lib/components/PostLayout.svelte
git commit -m "Restyle post headers and simplify the error page"
```

---

### Task 8: Audit a post with code, then verify everything

**Files:**

- Modify: `tests/` — add an accessibility spec covering a writing post
- Verify: the whole site

**Interfaces:**

- Consumes: everything above.

- [ ] **Step 1: Find the existing test layout**

```bash
ls tests/ && ls tests/*/
```

Note the directory convention and the `playwright.config.ts` `testDir`, then place the new spec to match.

- [ ] **Step 2: Verify existing coverage instead of adding a duplicate**

`tests/a11y/audit.spec.ts` already audits `/writing/example-post/` in both
themes and both viewports, and that post contains a fenced `ts` block. Adding a
second spec for the same route is churn. Run what exists:

```bash
pnpm exec playwright test tests/a11y --reporter=line
```

Expected: 16 passing. Skip the spec below unless coverage is actually missing.

- [ ] **Step 2b (skipped): Write the failing audit**

Create `tests/a11y/post.spec.ts` (adjust the path to the convention found in Step 1):

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/** The iMac build log contains prose, images, and fenced code. */
const POST = '/writing/1-imac/';

for (const theme of ['light', 'dark'] as const) {
  test(`${theme} post has no serious or critical accessibility violations`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
    await page.goto(POST);

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

    const violations = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? '')
    );
    expect(violations).toEqual([]);
  });
}
```

- [ ] **Step 3: Run it**

```bash
pnpm exec playwright test tests/a11y/post.spec.ts
```

Expected: PASS. Had this existed before this work, it would have failed on the 1.03:1 keyword contrast. If it fails now, the offending token is in `prose.css` — fix the token, never the test.

- [ ] **Step 4: Sweep for every removed name**

```bash
grep -rn "tp-color-\|eyebrow\|link-line\|neon-hover\|reveal\|↗\|LiveSignal\|SystemClock\|bg-accent\|text-accent\|ring-ink\|border-line\|text-muted\|text-paper\|bg-ink" src/ \
  --include=*.svelte --include=*.css --include=*.ts || echo "clean"
```

Expected: `clean`. Any hit is a missed replacement — fix it before continuing.

- [ ] **Step 5: Check the generated copy is gone**

```bash
grep -rn "Hello\.\|Ideas\.\|Thoughts\|went quiet\|First dispatch\|Say hello\|Get in touch\|Research + Product" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 6: Full build and test**

```bash
pnpm lint
pnpm check
pnpm build
pnpm test
```

Expected: all green. `pnpm build` must prerender every route; a build error naming a missing export means the `ui` package was not rebuilt after its own plan.

- [ ] **Step 7: Look at the site**

```bash
pnpm preview
```

Walk `/`, `/talks/`, `/writing/`, one post, and a 404, in both themes. Check specifically:

- Tables scroll horizontally on a narrow window without the page scrolling sideways.
- `j`/`k` move the row band; `/` reaches the search box; `?` opens the help.
- The amber band is legible in dark mode, including the media-type labels.
- No acid green anywhere.

Stop the server.

- [ ] **Step 8: Commit**

```bash
git add tests
git commit -m "Audit a writing post for accessibility"
```

---

## Done criteria

- `pnpm lint && pnpm check && pnpm build && pnpm test` is green.
- Both `grep` sweeps in Task 8 return `clean`.
- The site has no hero, no card grid, no call to action, and no live telemetry.
- Syntax keywords are legible in light mode — the bug that motivated the audit.
- `package.json` `"version"` is unchanged.
- `static/talks/assets/other/gans.pdf` and `xgboost.pdf` remain unstaged.
