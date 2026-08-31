/**
 * @param {any} node
 * @param {(node: any) => void} visitor
 */
const walk = (node, visitor) => {
  visitor(node);
  for (const child of node.children ?? []) walk(child, visitor);
};

/** @param {any} node */
const classNames = (node) => {
  const value = node.properties?.className;
  return Array.isArray(value) ? value : value ? [value] : [];
};

/**
 * Numbers footnote references.
 *
 * `remark-footnotes` renders the identifier as the visible marker, so
 * `[^images]` shows up as a superscript "images" while the list at the bottom
 * is an ordinary numbered list. This rewrites each marker to the position of
 * the note it points at, so references and definitions agree.
 *
 * @returns {(tree: any) => void}
 */
export function rehypeFootnoteNumbers() {
  return (tree) => {
    /** @type {Map<string, number>} */
    const order = new Map();

    walk(tree, (node) => {
      if (node.type !== 'element' || !classNames(node).includes('footnotes')) return;
      walk(node, (candidate) => {
        if (candidate.type !== 'element' || candidate.tagName !== 'ol') return;
        const items = (candidate.children ?? []).filter(
          (/** @type {any} */ child) => child.type === 'element' && child.tagName === 'li'
        );
        items.forEach((/** @type {any} */ item, /** @type {number} */ index) => {
          if (typeof item.properties?.id === 'string') order.set(item.properties.id, index + 1);
        });
      });
    });

    if (!order.size) return;

    walk(tree, (node) => {
      if (node.type !== 'element' || node.tagName !== 'a') return;
      if (!classNames(node).includes('footnote-ref')) return;

      const target = String(node.properties?.href ?? '').replace(/^#/, '');
      const number = order.get(target);
      if (!number) return;

      node.properties = { ...node.properties, 'aria-label': `Footnote ${number}` };
      node.children = [{ type: 'text', value: String(number) }];
    });
  };
}
