<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { CommandPalette, Footer, Nav } from '@timkpaine/ui';
  import { buildCommands } from '$lib/commands';

  let { children } = $props();

  const commands = buildCommands();
</script>

<svelte:head>
  <link rel="alternate" type="application/rss+xml" title="Tim Paine — Writing" href="/writing/rss.xml" />
</svelte:head>

<CommandPalette {commands} placeholder="Go to a page, post, or talk…" />

<Nav currentPath={page.url.pathname} />
<main>{@render children()}</main>
<Footer />
