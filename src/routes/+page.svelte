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
    <p class="tp-dim">
      Point72 · Cubist, Central Research Team. Open source at {organizations.slice(0, 5).join(', ')}, and
      <a href="https://github.com/timkpaine">more <span class="tp-host">github.com</span></a>.
    </p>
  </header>

  <DataTable caption="Résumé" meta="{roleRows.length} rows" columns={roleColumns} rows={roleRows} />

  <div>
    <DataTable
      caption="Talks"
      meta="{talks.length} total, {talkRows.length} shown"
      columns={talkColumns}
      rows={talkRows}
    />
    <p class="more"><a href="/talks/">All {talks.length} talks</a></p>
  </div>

  {#if writingRows.length}
    <div>
      <DataTable
        caption="Writing"
        meta="{writingRows.length} {writingRows.length === 1 ? 'post' : 'posts'}"
        columns={writingColumns}
        rows={writingRows}
        href={(row) => String(row.url)}
      />
      <p class="more"><a href="/writing/">All writing</a></p>
    </div>
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
    margin: 0.6rem 0 0;
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
