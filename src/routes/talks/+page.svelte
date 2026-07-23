<script lang="ts">
  import { talks } from '$lib/data/site';
</script>

<svelte:head>
  <title>Talks — Tim Paine</title>
  <meta
    name="description"
    content="Talks by Tim Paine on Jupyter, data visualization, open source, and specialized computing."
  />
  <link rel="canonical" href="https://tim.paine.nyc/talks/" />
</svelte:head>

<section class="mx-auto max-w-[92rem] px-5 pb-16 pt-16 sm:px-8 lg:px-12 lg:pb-24 lg:pt-24">
  <p class="eyebrow mb-6 text-muted">Talks / 2020—Now</p>
  <div class="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
    <h1 class="max-w-5xl text-[clamp(4rem,10vw,9rem)] font-medium leading-[0.84] tracking-[-0.075em]">
      Ideas are better <span class="font-serif italic font-normal">in motion.</span>
    </h1>
    <p class="max-w-lg text-lg leading-relaxed text-muted lg:pb-2">
      Conference talks, practical demos, and a growing archive of slides about building software
      for data-intensive work.
    </p>
  </div>
</section>

<section class="border-t border-line">
  <div class="mx-auto max-w-[92rem] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
    <div class="border-t border-line">
      {#each talks as talk, index}
        <article class="grid gap-6 border-b border-line py-8 lg:grid-cols-[5rem_minmax(0,1.4fr)_minmax(14rem,0.6fr)] lg:py-10">
          <div class="flex items-baseline justify-between lg:block">
            <p class="eyebrow text-muted">{talk.year}</p>
            <p class="font-mono text-[0.6rem] text-muted lg:mt-2">{String(index + 1).padStart(2, '0')}</p>
          </div>
          <div>
            <h2 class="max-w-3xl text-2xl font-medium leading-tight tracking-[-0.045em] sm:text-4xl">
              {talk.title}
            </h2>
            <p class="mt-4 max-w-2xl leading-relaxed text-muted">{talk.description}</p>
          </div>
          <div class="lg:text-right">
            <p class="mb-5 text-sm font-semibold">{talk.event}</p>
            <div class="flex flex-wrap gap-5 text-sm lg:justify-end">
              {#if 'recording' in talk}
                <a class="link-line" href={talk.recording}>Watch ↗</a>
              {/if}
              {#if 'slides' in talk}
                <a class="link-line" href={talk.slides}>Slides ↗</a>
              {/if}
              {#if 'source' in talk}
                <a class="link-line" href={talk.source}>Source ↗</a>
              {/if}
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>
