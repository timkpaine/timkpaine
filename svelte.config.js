import adapter from '@sveltejs/adapter-static';
import { fileURLToPath } from 'node:url';
import { mdsvex } from 'mdsvex';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkFootnotes from 'remark-footnotes';
import { highlighter } from './plugins/highlight.js';
import { rehypeFootnoteNumbers } from './plugins/rehype-footnote-numbers.js';
import { rehypeScrollableRegions } from './plugins/rehype-scrollable-regions.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    mdsvex({
      extensions: ['.svx'],
      layout: { _: fileURLToPath(new URL('./src/lib/components/PostLayout.svelte', import.meta.url)) },
      highlight: { highlighter },
      remarkPlugins: [remarkFootnotes],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
        rehypeFootnoteNumbers,
        rehypeScrollableRegions
      ]
    })
  ],
  kit: {
    adapter: adapter({ fallback: '404.html', precompress: true, strict: true }),
    prerender: { entries: ['*'] }
  }
};

export default config;
