<script lang="ts">
  import { page } from '$app/state';
  import { BRAND_NAME, SITE_URL } from '@timkpaine/ui';
  import Seo from '$lib/components/Seo.svelte';
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

<article class="mx-auto max-w-[68rem] px-5 pb-24 pt-14 sm:px-8 lg:px-12 lg:pt-20">
  <header class="border-b border-line pb-10">
    <p class="eyebrow mb-6 text-muted">
      <a class="link-line" href="/writing/">Writing</a>
      <span class="mx-2">/</span>
      <time datetime={toIsoDate(date)}>{formatDate(date)}</time>
      {#if draft}
        <span class="ml-3 rounded-full border border-line px-2 py-0.5 text-[0.6rem]">Draft</span>
      {/if}
    </p>

    <p
      class="mb-7 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted"
      data-testid="human-written"
    >
      <svg
        class="size-3.5 text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.9"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M6.5 10.5V20H4a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1h2.5Z" />
        <path d="M6.5 10.5 10.8 3a2.4 2.4 0 0 1 2.3 3.1L12.3 9H18a2 2 0 0 1 2 2.4l-1.2 6.2a2 2 0 0 1-2 1.4H6.5" />
      </svg>
      Written by a human
    </p>
    <h1 class="max-w-4xl text-[clamp(2.75rem,6vw,5rem)] font-medium leading-[0.94] tracking-[-0.06em]">
      {title}
    </h1>
    <p class="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
    {#if tags.length}
      <ul class="mt-7 flex flex-wrap gap-2">
        {#each tags as tag}
          <li
            class="rounded-full border border-line px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted"
          >
            {tag}
          </li>
        {/each}
      </ul>
    {/if}
  </header>

  <div class="prose mt-12">
    {@render children()}
  </div>

  <footer class="mt-16 border-t border-line pt-8">
    <a class="link-line text-sm font-semibold" href="/writing/">← All writing</a>
  </footer>
</article>
