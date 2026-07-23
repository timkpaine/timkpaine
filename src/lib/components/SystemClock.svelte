<script lang="ts">
  import { onMount } from 'svelte';

  let now: Date | null = null;

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

    update();
    const interval = window.setInterval(update, 1000);

    return () => window.clearInterval(interval);
  });
</script>

<aside
  class="fixed bottom-3 right-3 z-50 hidden min-w-28 border border-ink bg-ink px-3 py-2 text-right text-paper shadow-[3px_3px_0_var(--color-accent)] sm:block"
  aria-label="System clock"
  title={now ? dateFormatter.format(now) : 'Local time'}
>
  <time
    class="block font-mono text-xs font-semibold tabular-nums tracking-[0.04em]"
    datetime={now?.toISOString()}
  >
    {now ? timeFormatter.format(now) : '--:--'}
  </time>
  <span class="mt-1 block font-mono text-[0.52rem] uppercase tracking-[0.14em] text-paper/55">
    Local / {now ? dateFormatter.format(now) : 'Loading'}
  </span>
</aside>
