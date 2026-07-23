<script lang="ts">
  import { experience, organizations, talks } from '$lib/data/site';
  import { onMount } from 'svelte';

  const signal = [22, 52, 34, 72, 46, 88, 62, 28, 54, 38, 78, 48, 92, 58, 32, 68, 42, 82, 56, 24, 64, 44, 74, 36];
  const weatherUrl =
    'https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current=temperature_2m&temperature_unit=fahrenheit&timezone=America%2FNew_York';

  let temperature: number | null = null;

  onMount(() => {
    const controller = new AbortController();

    const updateWeather = async () => {
      try {
        const response = await fetch(weatherUrl, { signal: controller.signal });
        if (!response.ok) return;

        const data = (await response.json()) as {
          current?: { temperature_2m?: number };
        };
        const nextTemperature = data.current?.temperature_2m;

        if (typeof nextTemperature === 'number' && Number.isFinite(nextTemperature)) {
          temperature = nextTemperature;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    };

    void updateWeather();
    const interval = window.setInterval(updateWeather, 15 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  });
</script>

<svelte:head>
  <title>Tim Paine — Software engineer and open-source maintainer</title>
  <meta
    name="description"
    content="New York software engineer and open-source builder working across data systems, visualization, Jupyter, and computing hardware."
  />
  <link rel="canonical" href="https://tim.paine.nyc/" />
</svelte:head>

<section class="mx-auto max-w-[92rem] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24">
  <div class="grid items-end gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)]">
    <div class="reveal">
      <p class="eyebrow mb-7 flex items-center gap-3 text-muted">
        <span class="size-2 rounded-full bg-accent ring-1 ring-ink"></span>
        Software engineer · Open-source maintainer
      </p>
      <h1 class="max-w-5xl text-[clamp(4.5rem,11vw,10.5rem)] font-medium leading-[0.84] tracking-[-0.075em]">
        Hello.
      </h1>
      <p class="mt-9 max-w-2xl text-lg leading-relaxed tracking-[-0.025em] text-muted sm:text-xl">
        New York–based engineer working across data systems, developer tools, visualization,
        machine learning, and computing hardware.
      </p>
    </div>

    <div class="reveal lg:pb-3" style="animation-delay: 120ms">
      <div class="border-y border-line py-5">
        <div class="mb-5 flex items-center justify-between">
          <span class="eyebrow text-muted">Live signal</span>
          <span class="flex flex-col items-end gap-1 font-mono uppercase">
            <span class="text-[0.65rem] tracking-[0.12em]" aria-live="polite">
              NYC / 40.71° N / {temperature === null ? '--' : Math.round(temperature)}°F
            </span>
            <a
              class="link-line text-[0.52rem] tracking-[0.1em] text-muted"
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
            >
              Weather by Open-Meteo ↗
            </a>
          </span>
        </div>
        <div class="flex h-32 items-end gap-[3px] overflow-hidden" aria-hidden="true">
          {#each signal as height, index}
            <span
              class="signal-bar min-w-1 flex-1 bg-ink"
              style:height={`${height}%`}
              style:animation-delay={`${index * -90}ms`}
            ></span>
          {/each}
        </div>
      </div>
      <div class="mt-4 grid grid-cols-2 gap-4 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted">
        <span>Data systems</span>
        <span class="text-right">Human interfaces</span>
      </div>
    </div>
  </div>
</section>

<section id="work" class="border-t border-line">
  <div class="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div class="mb-12 grid gap-5 md:grid-cols-2 md:items-end">
      <div>
        <p class="eyebrow mb-5 text-muted">01 / GitHub</p>
        <h2 class="text-4xl font-medium tracking-[-0.055em] sm:text-6xl">
          Organizations & communities.
        </h2>
      </div>
      <p class="max-w-xl text-base leading-relaxed text-muted md:justify-self-end">
        A selection of the accounts and open-source communities that shape my work.
      </p>
    </div>

    <div class="grid border-l border-t border-line sm:grid-cols-2 xl:grid-cols-3">
      {#each organizations as organization, index}
        <a
          class="group min-h-60 border-b border-r border-line p-6 transition-colors hover:bg-accent sm:min-h-72 sm:p-8"
          href={organization.href}
          target="_blank"
          rel="noreferrer"
        >
          <div class="flex items-start justify-between gap-6">
            <img
              class="size-12 rounded-xl bg-white object-cover ring-1 ring-line"
              src={organization.avatar}
              alt={`${organization.name} logo`}
              width="48"
              height="48"
            />
            <span class="text-xl transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </div>
          <p class="eyebrow mt-10 text-muted group-hover:text-ink">
            {String(index + 1).padStart(2, '0')} / @{organization.handle}
          </p>
          <h3 class="mt-3 text-2xl font-medium tracking-[-0.045em] sm:text-3xl">
            {organization.name}
          </h3>
          <p class="mt-4 max-w-lg leading-relaxed text-muted group-hover:text-ink">
            {organization.description}
          </p>
        </a>
      {/each}
    </div>

    <a class="link-line mt-9 inline-block text-sm font-semibold" href="https://github.com/timkpaine">
      View full GitHub profile ↗
    </a>
  </div>
</section>

<section class="border-t border-line bg-ink text-paper">
  <div class="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
    <div class="mb-12 grid gap-5 md:grid-cols-2 md:items-end">
      <div>
        <p class="eyebrow mb-5 text-paper/55">02 / Recent talks</p>
        <h2 class="text-4xl font-medium tracking-[-0.055em] sm:text-6xl">Ideas.</h2>
      </div>
      <p class="max-w-lg text-base leading-relaxed text-paper/60 md:justify-self-end">
        Talks on open source, high-performance interfaces, notebooks, and specialized computing.
      </p>
    </div>

    <div class="border-t border-paper/25">
      {#each talks.slice(0, 5) as talk}
        <article class="group grid gap-4 border-b border-paper/25 py-7 md:grid-cols-[5rem_1fr_1fr_auto] md:items-center">
          <p class="font-mono text-xs text-paper/45">{talk.year}</p>
          <h3 class="max-w-xl text-xl font-medium tracking-[-0.035em]">{talk.title}</h3>
          <p class="text-sm text-paper/50">{talk.event}</p>
          <div class="flex gap-4 text-sm">
            {#if 'recording' in talk}
              <a class="link-line" href={talk.recording}>Watch ↗</a>
            {/if}
            {#if 'slides' in talk}
              <a class="link-line" href={talk.slides}>Slides ↗</a>
            {/if}
          </div>
        </article>
      {/each}
    </div>
    <a class="link-line mt-9 inline-block text-sm font-semibold" href="/talks/">View full archive →</a>
  </div>
</section>

<section id="about" class="border-t border-line">
  <div class="mx-auto grid max-w-[92rem] gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-12 lg:py-28">
    <div>
      <p class="eyebrow mb-5 text-muted">03 / About</p>
      <h2 class="max-w-md text-4xl font-medium tracking-[-0.055em] sm:text-6xl">
        Research + Product.
      </h2>
    </div>
    <div>
      <p class="max-w-2xl text-2xl leading-snug tracking-[-0.04em] sm:text-3xl">
        My background is building full-stack applications for front-office users and developers,
        where performance and clarity have to coexist.
      </p>
      <p class="mt-7 max-w-2xl leading-relaxed text-muted">
        I contribute to large-scale open-source communities including JupyterLab and conda-forge,
        advise teams in data and finance, and teach what I learn along the way.
      </p>

      <div class="mt-14 border-t border-line">
        {#each experience as item}
          <div class="grid gap-2 border-b border-line py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-baseline">
            <p class="font-semibold tracking-[-0.02em]">{item.company}</p>
            <p class="text-sm text-muted">{item.role}</p>
            <p class="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted">{item.years}</p>
          </div>
        {/each}
      </div>

      <div class="mt-10 flex flex-wrap gap-7">
        <a class="link-line text-sm font-semibold" href="https://www.linkedin.com/in/timkpaine/">Get in touch ↗</a>
        <a class="link-line text-sm font-semibold" href="/rsc/TPCV.pdf">Résumé ↗</a>
      </div>
    </div>
  </div>
</section>

<style>
  .signal-bar {
    transform-origin: bottom;
    animation: signal 1.8s ease-in-out infinite alternate;
  }

  @keyframes signal {
    to {
      transform: scaleY(0.34);
      opacity: 0.38;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .signal-bar {
      animation: none;
    }
  }
</style>
