import prism from 'prismjs';
import loadLanguages from 'prismjs/components/index.js';

loadLanguages(['bash', 'css', 'diff', 'json', 'markup', 'python', 'rust', 'typescript', 'yaml']);

const ALIASES = { js: 'javascript', ts: 'typescript', sh: 'bash', shell: 'bash', yml: 'yaml', html: 'markup' };

const escapeHtml = (code) => code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Braces and backticks would otherwise be read as Svelte template syntax. */
const escapeSvelte = (html) => html.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/`/g, '&#96;');

/**
 * mdsvex writes code blocks as raw HTML before rehype runs, so a rehype plugin
 * cannot reach them. Emitting the markup here is the only place `tabindex` can
 * be added, which scrollable code blocks need for keyboard access.
 */
export function highlighter(code, lang) {
  const language = ALIASES[lang] ?? lang;
  const grammar = language ? prism.languages[language] : undefined;
  const highlighted = grammar ? prism.highlight(code, grammar, language) : escapeHtml(code);

  // Svelte flags tabindex on a non-interactive element, but axe requires it so
  // keyboard users can scroll a long line. The a11y rule wins here.
  return [
    '<!-- svelte-ignore a11y_no_noninteractive_tabindex -->',
    `<pre tabindex="0" class="language-${language ?? 'text'}"><code>${escapeSvelte(highlighted)}</code></pre>`
  ].join('');
}
