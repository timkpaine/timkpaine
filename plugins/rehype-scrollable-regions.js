const walk = (node, parent, visitor) => {
  const children = Array.isArray(node.children) ? [...node.children] : [];
  for (const child of children) walk(child, node, visitor);
  if (parent) visitor(node, parent);
};

/**
 * Makes horizontally scrollable tables keyboard accessible.
 *
 * A scrolling region must be focusable or keyboard users cannot reach what
 * overflows (axe: `scrollable-region-focusable`). The table is wrapped so the
 * wrapper scrolls rather than the table itself — styling a table as a block
 * would drop its row and column semantics for screen readers.
 *
 * Code blocks are handled in `plugins/highlight.js`, because mdsvex emits them
 * as raw HTML before rehype runs.
 */
export function rehypeScrollableRegions() {
  return (tree) => {
    walk(tree, null, (node, parent) => {
      if (node.type !== 'element' || node.tagName !== 'table') return;
      if (parent.type === 'element' && parent.tagName === 'div') return;

      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['table-scroll'], tabindex: 0, role: 'region', 'aria-label': 'Table' },
        children: [node]
      };

      // Svelte flags tabindex on a non-interactive element, but axe requires it
      // for the region to be reachable. The a11y rule wins here.
      const ignore = { type: 'raw', value: '<!-- svelte-ignore a11y_no_noninteractive_tabindex -->' };

      parent.children.splice(parent.children.indexOf(node), 1, ignore, wrapper);
    });
  };
}
