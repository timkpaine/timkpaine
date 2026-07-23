<script lang="ts">
  import '../app.css';
  import Footer from '$lib/components/Footer.svelte';
  import Nav from '$lib/components/Nav.svelte';
  import SystemClock from '$lib/components/SystemClock.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>Tim Paine — Software engineer and open-source maintainer</title>
  <meta
    name="description"
    content="Tim Paine builds high-performance software for data, analytics, and scientific computing."
  />
  <meta property="og:site_name" content="Tim Paine" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Tim Paine — Software engineer and open-source maintainer" />
  <meta
    property="og:description"
    content="High-performance software for data, analytics, and scientific computing."
  />
  <meta property="og:url" content="https://tim.paine.nyc" />
  <meta name="twitter:card" content="summary" />
</svelte:head>

<Nav />
<main>{@render children()}</main>
<Footer />
<SystemClock />
