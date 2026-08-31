<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { formatDate, toIsoDate } from '$lib/dates';
  import { visiblePosts } from '$lib/posts';
</script>

<Seo
  title="Writing — Tim Paine"
  description="Notes by Tim Paine on software, open source, data systems, and the work around them."
/>

<section class="mx-auto min-h-[70vh] max-w-[92rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
  <p class="eyebrow mb-6 text-muted">Writing / {visiblePosts.length || 'Soon'}</p>
  <div class="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
    <h1 class="max-w-5xl text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.84] tracking-[-0.075em]">Thoughts</h1>
    <div class="border-t border-line pt-6 lg:mb-2">
      <p class="max-w-lg text-lg leading-relaxed text-muted">A place for my informal thoughts and hobby projects.</p>
      <a
        class="link-line mt-6 inline-block font-mono text-[0.65rem] uppercase tracking-[0.12em]"
        href="/writing/rss.xml"
      >
        Subscribe via RSS →
      </a>
    </div>
  </div>

  {#if visiblePosts.length}
    <div class="mt-20 border-t border-line">
      {#each visiblePosts as post}
        <article class="neon-hover group grid gap-3 border-b border-line py-8 md:grid-cols-[10rem_1fr] md:gap-10">
          <p class="neon-hover-muted font-mono text-xs text-muted">
            <time datetime={toIsoDate(post.date)}>{formatDate(post.date)}</time>
          </p>
          <div>
            <h2 class="max-w-2xl text-2xl font-medium tracking-[-0.04em] sm:text-3xl">
              <a class="link-line" href={post.url}>{post.title}</a>
              {#if post.draft}
                <span
                  class="ml-3 align-middle rounded-full border border-line px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted"
                >
                  Draft
                </span>
              {/if}
            </h2>
            <p class="neon-hover-muted mt-3 max-w-2xl leading-relaxed text-muted">{post.description}</p>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <p class="mt-20 border-t border-line pt-8 font-mono text-[0.65rem] uppercase tracking-[0.12em]">
      First dispatch in progress
      <span class="ml-2 inline-block size-2 rounded-full bg-accent ring-1 ring-ink"></span>
    </p>
  {/if}
</section>
