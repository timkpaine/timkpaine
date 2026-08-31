<script lang="ts">
  import { page } from '$app/state';
  import { BRAND_NAME, SITE_URL } from '@timkpaine/ui';
  import type { Snippet } from 'svelte';

  type Props = {
    /** Full document title, used verbatim. */
    title: string;
    description: string;
    type?: 'website' | 'article';
    /** Root-relative path to the social card. */
    image?: string;
    noindex?: boolean;
    /** Extra head tags, such as article metadata or structured data. */
    children?: Snippet;
  };

  let { title, description, type = 'website', image = '/og.png', noindex = false, children }: Props = $props();

  const canonical = $derived(`${SITE_URL}${page.url.pathname}`);
  const cardUrl = $derived(image.startsWith('http') ? image : `${SITE_URL}${image}`);
  const cardType = $derived(type === 'article' ? 'summary_large_image' : 'summary');
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}

  <meta property="og:site_name" content={BRAND_NAME} />
  <meta property="og:type" content={type} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={canonical} />
  <meta property="og:image" content={cardUrl} />

  <meta name="twitter:card" content={cardType} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={cardUrl} />

  {@render children?.()}
</svelte:head>
