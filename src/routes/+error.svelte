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
