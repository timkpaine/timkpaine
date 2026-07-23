<script lang="ts">
  import { onMount } from 'svelte';

  let now: Date | null = null;
  let clock: HTMLElement | null = null;
  let isInverted = false;

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  onMount(() => {
    const update = () => {
      now = new Date();
    };

    let frame: number | null = null;
    const updateContrast = () => {
      if (frame !== null) return;

      frame = window.requestAnimationFrame(() => {
        frame = null;
        if (!clock) return;

        const clockRect = clock.getBoundingClientRect();
        const centerX = clockRect.left + clockRect.width / 2;
        const centerY = clockRect.top + clockRect.height / 2;

        isInverted = Array.from(document.querySelectorAll<HTMLElement>('[data-clock-invert]')).some(
          (surface) => {
            const surfaceRect = surface.getBoundingClientRect();
            return (
              centerX >= surfaceRect.left &&
              centerX <= surfaceRect.right &&
              centerY >= surfaceRect.top &&
              centerY <= surfaceRect.bottom
            );
          }
        );
      });
    };

    update();
    const interval = window.setInterval(update, 1000);
    updateContrast();
    window.addEventListener('scroll', updateContrast, { passive: true });
    window.addEventListener('resize', updateContrast);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('scroll', updateContrast);
      window.removeEventListener('resize', updateContrast);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  });
</script>

<aside
  bind:this={clock}
  class={`fixed bottom-3 right-3 z-50 hidden min-w-28 border px-3 py-2 text-right shadow-[3px_3px_0_var(--color-accent)] sm:block ${
    isInverted ? 'border-paper bg-paper text-ink' : 'border-ink bg-ink text-paper'
  }`}
  aria-label="System clock"
  title={now ? dateFormatter.format(now) : 'Local time'}
>
  <time
    class="block font-mono text-xs font-semibold tabular-nums tracking-[0.04em]"
    datetime={now?.toISOString()}
  >
    {now ? timeFormatter.format(now) : '--:--'}
  </time>
  <span
    class={`mt-1 block font-mono text-[0.52rem] uppercase tracking-[0.14em] ${
      isInverted ? 'text-ink/55' : 'text-paper/55'
    }`}
  >
    Local / {now ? dateFormatter.format(now) : 'Loading'}
  </span>
</aside>
