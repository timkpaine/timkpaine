<script lang="ts">
  import { page } from '$app/state';
  import { BRAND_NAME, SITE_URL } from '@timkpaine/ui';
  import Seo from '$lib/components/Seo.svelte';
  import TagIcon from '$lib/components/TagIcon.svelte';
  import { formatDate, toIsoDate } from '$lib/dates';
  import type { PostMetadata } from '$lib/posts';

  type Props = PostMetadata & { children: import('svelte').Snippet };

  let { title, description, date, updated, tags = [], image, draft = false, children }: Props = $props();

  const canonical = $derived(`${SITE_URL}${page.url.pathname}`);
  const cardUrl = $derived(`${SITE_URL}${image ?? '/og.png'}`);

  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished: date,
    dateModified: updated ?? date,
    image: cardUrl,
    url: canonical,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    author: { '@type': 'Person', name: BRAND_NAME, url: SITE_URL },
    publisher: { '@type': 'Person', name: BRAND_NAME, url: SITE_URL },
    ...(tags.length ? { keywords: tags.join(', ') } : {})
  });
</script>

<Seo title={`${title} — ${BRAND_NAME}`} {description} type="article" image={image ?? '/og.png'} noindex={draft}>
  <meta property="article:published_time" content={date} />
  {#if updated}
    <meta property="article:modified_time" content={updated} />
  {/if}
  {#each tags as tag}
    <meta property="article:tag" content={tag} />
  {/each}
  {@html `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}<\/script>`}
</Seo>

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

  <div class="prose mt-12">
    {@render children()}
  </div>

  <footer>
    <a href="/writing/">All writing</a>
  </footer>
</article>

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
    max-width: 30ch;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    letter-spacing: -0.015em;
    line-height: 1.15;
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
