import { SITE_URL } from '@timkpaine/ui';

/** Shape returned by a Vite `?enhanced` image import. */
export type EnhancedPicture = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

export type PostMetadata = {
  title: string;
  description: string;
  /**
   * Frontmatter dates arrive as full ISO strings: YAML parses an unquoted
   * `2026-08-29` into a Date, which mdsvex then serialises. Quoted dates stay
   * `YYYY-MM-DD`, so both forms have to be handled.
   */
  date: string;
  updated?: string;
  tags?: string[];
  image?: string;
  draft?: boolean;
};

export type Post = PostMetadata & {
  slug: string;
  url: string;
  absoluteUrl: string;
};

const parseDate = (value: string | Date): Date => {
  if (value instanceof Date) return value;
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
};

const modules = import.meta.glob<PostMetadata>('/src/routes/writing/*/+page.svx', {
  eager: true,
  import: 'metadata'
});

export const posts: Post[] = Object.entries(modules)
  .map(([path, metadata]) => {
    const slug = path.split('/').at(-2) ?? '';
    return { ...metadata, slug, url: `/writing/${slug}/`, absoluteUrl: `${SITE_URL}/writing/${slug}/` };
  })
  .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

/** Drafts stay reachable by direct URL but are kept out of the index, feed, and sitemap. */
export const publishedPosts = posts.filter((post) => !post.draft);

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
