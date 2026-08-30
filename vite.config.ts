import { enhancedImages } from '@sveltejs/enhanced-img';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';
import { svxImages } from './plugins/vite-svx-images.js';

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
  plugins: [svxImages(), tailwindcss(), imageTools, sveltekit()]
});
