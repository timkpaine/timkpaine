<script lang="ts">
  import { DataTable, type Column, type Row } from '@timkpaine/ui';
  import Seo from '$lib/components/Seo.svelte';
  import { talks } from '$lib/data/site';

  const columns: Column[] = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'year', label: 'Year', sortable: true },
    { key: 'event', label: 'Venue', sortable: true },
    { key: 'description', label: 'Summary' }
  ];

  const rows: Row[] = talks.map((talk) => ({ ...talk }));

  /** The media links for one talk, in a stable order. */
  function media(talk: Record<string, string>): { href: string; label: string }[] {
    const out: { href: string; label: string }[] = [];
    if (talk.recording) out.push({ href: talk.recording, label: 'video' });
    if (talk.slides) out.push({ href: talk.slides, label: 'slides' });
    if (talk.source) out.push({ href: talk.source, label: 'source' });
    return out;
  }
</script>

<Seo
  title="Talks — Tim Paine"
  description="Conference talks by Tim Paine on Jupyter, data visualization, open source, and specialized computing."
/>

<section class="page">
  <header>
    <h1>Talks</h1>
    <p class="tp-dim">{talks.length} talks, 2020 to 2025.</p>
  </header>

  <DataTable caption="Archive" meta="{talks.length} rows" {columns} {rows} />

  <div class="media">
    <h2>Slides and recordings</h2>
    <ul>
      {#each talks as talk (talk.title)}
        <li>
          <span class="title">{talk.title}</span>
          {#each media(talk as unknown as Record<string, string>) as link (link.href)}
            <a class="tp-link-line {link.label}" href={link.href}>{link.label}</a>
          {/each}
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .page {
    display: grid;
    gap: 2.25rem;
    width: min(calc(100% - 2.5rem), var(--tp-content-width));
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

  h2 {
    margin: 0 0 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  ul {
    display: grid;
    gap: 0.35rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 0.3rem 0;
    border-bottom: var(--tp-border-width) solid var(--tp-rule);
    font-size: 0.8rem;
  }

  .title {
    flex: 1 1 24ch;
  }

  a {
    color: var(--tp-fg);
  }

  a.video {
    color: var(--tp-video);
  }

  a.slides,
  a.source {
    color: var(--tp-slides);
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
