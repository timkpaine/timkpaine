import { goto } from '$app/navigation';
import { setTheme, type Command } from '@timkpaine/ui';
import { talks } from '$lib/data/site';
import { visiblePosts } from '$lib/posts';

/**
 * Everything the palette can reach: the three pages, every writing post, every
 * talk with whatever media it has, the off-site profiles, and the theme.
 *
 * Internal routes go through `goto` so navigation stays client-side. Talk
 * slides are prerendered HTML rather than SvelteKit routes, so they use a plain
 * href and take a full page load.
 */
export function buildCommands(): Command[] {
  const commands: Command[] = [
    { id: 'page:index', label: 'index', group: 'pages', run: () => goto('/') },
    { id: 'page:talks', label: 'talks', group: 'pages', run: () => goto('/talks/') },
    { id: 'page:writing', label: 'writing', group: 'pages', run: () => goto('/writing/') }
  ];

  for (const post of visiblePosts) {
    commands.push({
      id: `post:${post.slug}`,
      label: post.draft ? `${post.title} (draft)` : post.title,
      hint: 'writing',
      group: 'writing',
      run: () => goto(post.url)
    });
  }

  for (const talk of talks) {
    const entry = talk as unknown as Record<string, string>;
    if (entry.recording) {
      commands.push({
        id: `talk:video:${talk.title}`,
        label: talk.title,
        hint: `${talk.event} · video`,
        group: 'talks',
        href: entry.recording,
        external: true
      });
    }
    if (entry.slides) {
      commands.push({
        id: `talk:slides:${talk.title}`,
        label: talk.title,
        hint: `${talk.event} · slides`,
        group: 'talks',
        href: entry.slides
      });
    }
  }

  commands.push(
    {
      id: 'link:github',
      label: 'GitHub',
      group: 'links',
      href: 'https://github.com/timkpaine',
      external: true
    },
    {
      id: 'link:linkedin',
      label: 'LinkedIn',
      group: 'links',
      href: 'https://www.linkedin.com/in/timkpaine/',
      external: true
    },
    { id: 'link:resume', label: 'Résumé', hint: 'PDF', group: 'links', href: '/rsc/TPCV.pdf' },
    { id: 'link:rss', label: 'RSS', hint: 'writing feed', group: 'links', href: '/writing/rss.xml' },
    { id: 'theme:light', label: 'theme light', group: 'theme', run: () => setTheme('light') },
    { id: 'theme:dark', label: 'theme dark', group: 'theme', run: () => setTheme('dark') }
  );

  return commands;
}
