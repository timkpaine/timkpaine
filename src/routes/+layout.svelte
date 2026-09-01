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
