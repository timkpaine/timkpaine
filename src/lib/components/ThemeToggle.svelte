<script lang="ts">
  import { onMount } from 'svelte';

  type Theme = 'light' | 'dark';

  let theme: Theme = 'light';

  function applyTheme(nextTheme: Theme) {
    theme = nextTheme;
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', nextTheme === 'dark' ? '#121411' : '#f2f0e9');
  }

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme);
  }

  onMount(() => {
    theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

    const preference = matchMedia('(prefers-color-scheme: dark)');
    const followPreference = (event: MediaQueryListEvent) => {
      if (localStorage.getItem('theme') === null) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    };

    preference.addEventListener('change', followPreference);
    return () => preference.removeEventListener('change', followPreference);
  });
</script>

<button
  class="grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
  type="button"
  aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  aria-pressed={theme === 'dark'}
  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  onclick={toggleTheme}
>
  {#if theme === 'dark'}
    <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </svg>
  {:else}
    <svg aria-hidden="true" class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
    </svg>
  {/if}
</button>
