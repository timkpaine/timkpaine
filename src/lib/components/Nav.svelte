<script lang="ts">
  import { page } from '$app/state';
  import ThemeToggle from './ThemeToggle.svelte';

  const links = [
    { href: '/#work', label: 'Work' },
    { href: '/talks/', label: 'Talks' },
    { href: '/writing/', label: 'Writing' }
  ];
</script>

<header class="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md">
  <nav class="mx-auto flex h-16 max-w-[92rem] items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Primary">
    <a class="group flex items-center gap-2.5" href="/" aria-label="Tim Paine, home">
      <span class="size-7 overflow-hidden rounded-full bg-black transition-transform group-hover:rotate-6">
        <img
          class="size-full object-cover"
          src="/static/img/logo.png"
          alt=""
          width="28"
          height="28"
        />
      </span>
      <span class="hidden text-sm font-semibold tracking-[-0.02em] min-[360px]:inline">Tim Paine</span>
    </a>

    <div class="flex items-center gap-4 sm:gap-6 lg:gap-8">
      {#each links as link}
        <a
          class:font-semibold={link.href !== '/#work' && page.url.pathname.startsWith(link.href)}
          class="link-line text-xs tracking-[-0.01em] text-muted transition-colors hover:text-ink sm:text-sm"
          href={link.href}
        >
          {link.label}
        </a>
      {/each}
      <ThemeToggle />
      <a
        class="hidden rounded-full border border-ink px-4 py-2 text-xs font-semibold transition-[border-color,box-shadow] hover:border-accent hover:shadow-[0_0_0_2px_var(--color-accent)] sm:block"
        href="https://www.linkedin.com/in/timkpaine/"
      >
        Say hello
      </a>
    </div>
  </nav>
</header>
