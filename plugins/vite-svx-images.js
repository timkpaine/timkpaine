const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*(\.{1,2}\/[^)\s]+?)(?:\s+"([^"]*)")?\s*\)/g;
const FENCE = /^(```|~~~)[\s\S]*?^\1/gm;
const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---/;
const COMPONENT = 'MdFigure';

/**
 * @param {string | undefined} value
 * @returns {string}
 */
const escapeAttribute = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');

/**
 * Masks fenced code blocks so image syntax inside them is left alone.
 *
 * @param {string} code
 * @returns {[string, (value: string) => string]}
 */
const maskFences = (code) => {
  /** @type {string[]} */
  const fences = [];
  const masked = code.replace(FENCE, (match) => {
    fences.push(match);
    return `  FENCE${fences.length - 1}  `;
  });
  /** @param {string} value */
  const restore = (value) => value.replace(/  FENCE(\d+)  /g, (_match, index) => fences[Number(index)]);
  return [masked, restore];
};

/**
 * Adds imports to the post's instance script, creating one when absent. They
 * must land after the frontmatter, which mdsvex expects at the very top.
 *
 * @param {string} code
 * @param {string[]} imports
 * @returns {string}
 */
const injectImports = (code, imports) => {
  const block = imports.join('\n');
  const frontmatter = code.match(FRONTMATTER);
  const offset = frontmatter ? frontmatter[0].length : 0;
  const rest = code.slice(offset);

  const existing = rest.match(/<script(?![^>]*\bcontext=)[^>]*>/);
  if (existing) {
    const at = offset + (existing.index ?? 0) + existing[0].length;
    return `${code.slice(0, at)}\n${block}${code.slice(at)}`;
  }

  return `${code.slice(0, offset)}\n\n<script>\n${block}\n</script>\n${rest}`;
};

/**
 * Rewrites relative markdown images in `.svx` posts into a Figure backed by an
 * `?enhanced` import, so plain markdown syntax still produces responsive
 * AVIF/WebP output.
 *
 * This is a `pre` Vite transform rather than a remark plugin because
 * `@sveltejs/enhanced-img` only inspects raw source. Anything mdsvex emits
 * later in the Svelte preprocess step is never seen by it.
 *
 * @returns {import('vite').Plugin}
 */
export function svxImages() {
  return {
    name: 'svx-markdown-images',
    enforce: 'pre',
    /**
     * @param {string} code
     * @param {string} id
     */
    transform(code, id) {
      if (!id.split('?')[0].endsWith('.svx')) return null;

      const [masked, restoreFences] = maskFences(code);
      /** @type {Map<string, string>} */
      const names = new Map();
      /** @type {string[]} */
      const imports = [];

      const rewritten = masked.replace(
        MARKDOWN_IMAGE,
        /**
         * @param {string} _match
         * @param {string} alt
         * @param {string} src
         * @param {string | undefined} title
         */
        (_match, alt, src, title) => {
          if (!names.has(src)) {
            const name = `__mdImage${names.size}`;
            names.set(src, name);
            imports.push(`import ${name} from '${src}?enhanced';`);
          }

          const attributes = [`src={${names.get(src)}}`, `alt="${escapeAttribute(alt)}"`];
          if (title) attributes.push(`caption="${escapeAttribute(title)}"`);
          return `<${COMPONENT} ${attributes.join(' ')} />`;
        }
      );

      if (!imports.length) return null;

      imports.unshift(`import ${COMPONENT} from '$lib/components/Figure.svelte';`);
      return { code: injectImports(restoreFences(rewritten), imports), map: null };
    }
  };
}
