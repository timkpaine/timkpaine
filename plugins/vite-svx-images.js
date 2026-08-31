const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*(\.{1,2}\/[^)\s]+?)(?:\s+"([^"]*)")?\s*\)/g;
const INERT = /<!--[\s\S]*?-->|^(```|~~~)[\s\S]*?^\1/gm;
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
 * Hides fenced code blocks and HTML comments.
 *
 * Neither is content: an image inside them must not be rewritten, and a
 * `<script>` shown as an example must not be mistaken for the post's own.
 *
 * @param {string} code
 * @returns {[string, (value: string) => string]}
 */
const maskInert = (code) => {
  /** @type {string[]} */
  const regions = [];
  const masked = code.replace(INERT, (match) => {
    regions.push(match);
    return `  INERT${regions.length - 1}  `;
  });
  /** @param {string} value */
  const restore = (value) => value.replace(/ {2}INERT(\d+) {2}/g, (_match, index) => regions[Number(index)]);
  return [masked, restore];
};

/**
 * Adds imports to the post's instance script, creating one when absent. They
 * must land after the frontmatter, which mdsvex expects at the very top.
 *
 * Runs against masked source so a `<script>` inside a comment is not treated
 * as the real one.
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

      const [masked, restoreInert] = maskInert(code);
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

      // Anything still looking like a relative image did not parse — usually an
      // unterminated title quote. It would otherwise render as literal text.
      for (const leftover of rewritten.match(/!\[[^\]]*\]\(\s*\.{1,2}\/[^\n]*/g) ?? []) {
        this.warn(`Malformed image in ${id.split('/').slice(-2).join('/')}: ${leftover.trim()}`);
      }

      if (!imports.length) return null;

      imports.unshift(`import ${COMPONENT} from '$lib/components/Figure.svelte';`);
      // Restore last, so masked regions never take part in the rewrite.
      return { code: restoreInert(injectImports(rewritten, imports)), map: null };
    }
  };
}
