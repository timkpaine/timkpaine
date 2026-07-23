<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>{page.status} — Tim Paine</title>
</svelte:head>

<section class="mx-auto grid min-h-[70vh] max-w-[92rem] place-items-center px-5 py-20 text-center">
  <div>
    <p class="eyebrow mb-5 text-muted">Error / {page.status}</p>
    <h1 class="text-5xl font-medium tracking-[-0.06em] sm:text-8xl">This path went quiet.</h1>
    <p class="mx-auto mt-6 max-w-md leading-relaxed text-muted">
      {page.error?.message ?? 'The page could not be found.'}
    </p>
    <a class="link-line mt-9 inline-block text-sm font-semibold" href="/">Return home →</a>
  </div>
</section>
