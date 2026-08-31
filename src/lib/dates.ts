/**
 * Date helpers for posts.
 *
 * These live apart from `posts.ts` on purpose. That module eagerly globs every
 * post, and a post renders through `PostLayout`, so anything the layout imports
 * from it would close a cycle: glob → post → layout → glob. Bundling hides the
 * problem, but the dev server serves real ES modules and throws on the
 * uninitialised glob binding.
 */

/**
 * Frontmatter dates arrive as full ISO strings, because YAML parses an unquoted
 * `2026-08-29` into a Date which mdsvex then serialises. A quoted date stays
 * `YYYY-MM-DD`, so both forms have to be handled.
 */
const parseDate = (value: string | Date): Date => {
  if (value instanceof Date) return value;
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
};

/** Sort key, newest first. */
export const dateOrder = (value: string) => parseDate(value).getTime();

export const formatDate = (value: string) =>
  parseDate(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

/** `YYYY-MM-DD`, for `datetime` attributes and sitemap `lastmod`. */
export const toIsoDate = (value: string) => parseDate(value).toISOString().slice(0, 10);

/** RFC 822, required by RSS `pubDate`. */
export const toRfc822 = (value: string) => parseDate(value).toUTCString();
