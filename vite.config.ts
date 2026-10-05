import adapter from '@sveltejs/adapter-static';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { mdsvex, type MdsvexOptions } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFootnotes from 'remark-footnotes';
import { highlighter } from './plugins/highlight.js';
import { rehypeFootnoteNumbers } from './plugins/rehype-footnote-numbers.js';
import { rehypeScrollableRegions } from './plugins/rehype-scrollable-regions.js';
import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { svxImages } from './plugins/vite-svx-images.js';

const WRITING_DIR = fileURLToPath(new URL('./src/routes/writing', import.meta.url));

/**
 * Route ids for posts marked `draft: true`. A production build lists no drafts,
 * so nothing links to them and they are never prerendered. They are the only
 * routes allowed to go unseen — anything else means a page fell out of the
 * build by accident.
 *
 * @returns {string[]}
 */
const draftRoutes = (): string[] => {
  const routes: string[] = [];

  for (const entry of readdirSync(WRITING_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;

    let source = '';
    try {
      source = readFileSync(`${WRITING_DIR}/${entry.name}/+page.svx`, 'utf8');
    } catch {
      continue;
    }

    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatter && /^draft:\s*true\s*$/m.test(frontmatter[1])) {
      routes.push(`/writing/${entry.name}`);
    }
  }

  return routes;
};

/**
 * `enhancedImages()` bundles two plugins: `imagetools`, which resolves the
 * `?enhanced` imports this site uses, and a markup transform that rewrites
 * `<enhanced:img>` tags. Posts render images through `Figure` instead, so the
 * markup transform is unused — and actively harmful here, because it matches
 * any file merely containing that tag name and then parses markdown as Svelte.
 * Writing about the tag in a post would otherwise fail the build.
 *
 * The published types declare a promise, but the implementation returns the
 * plugin array synchronously.
 */
const imageTools = (enhancedImages() as unknown as Plugin[]).filter(
  (plugin) => plugin.name !== 'vite-plugin-enhanced-img-markup'
);

export default defineConfig({
  plugins: [
    svxImages(),
    tailwindcss(),
    imageTools,
    sveltekit({
      extensions: ['.svelte', '.svx'],
      preprocess: [
        mdsvex({
          extensions: ['.svx'],
          layout: { _: fileURLToPath(new URL('./src/lib/components/PostLayout.svelte', import.meta.url)) },
          highlight: { highlighter },
          remarkPlugins: [remarkFootnotes],
          // mdsvex declares an older unified plugin interface than these rehype plugins.
          rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
            rehypeFootnoteNumbers,
            rehypeScrollableRegions
          ] as unknown as MdsvexOptions['rehypePlugins']
        })
      ],
      adapter: adapter({ fallback: '404.html', precompress: true, strict: true }),
      // Crawl from the home page rather than prerendering every route, so a
      // draft that nothing links to is never written into the build.
      prerender: {
        // Crawl from the entry points rather than prerendering every route, so a
        // draft that nothing links to is never written into the build. The feed
        // is reached through its <link rel="alternate">; the sitemap is not
        // linked from anywhere, so it has to be named here.
        entries: ['/', '/sitemap.xml'],
        handleUnseenRoutes: ({ routes, message }) => {
          const drafts = draftRoutes();
          const unexpected = routes.filter((route) => !drafts.includes(route));
          if (unexpected.length) throw new Error(message);
        }
      }
    })
  ]
});
