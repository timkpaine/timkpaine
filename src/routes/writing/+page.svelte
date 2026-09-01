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
