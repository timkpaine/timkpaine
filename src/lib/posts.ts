import { SITE_URL } from '@timkpaine/ui';
import { dateOrder } from '$lib/dates';

/** Shape returned by a Vite `?enhanced` image import. */
export type EnhancedPicture = {
  sources: Record<string, string>;
  img: { src: string; w: number; h: number };
};

export type PostMetadata = {
  title: string;
  description: string;
  /** See `parseDate` in `$lib/dates` for the formats this arrives in. */
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

/**
 * Anything a post renders with must import from `$lib/dates`, not from here.
 * This glob pulls in every post, so importing back into this module from a
 * post's layout would create a cycle the dev server cannot resolve.
 */
const modules = import.meta.glob<PostMetadata>('/src/routes/writing/*/+page.svx', {
  eager: true,
  import: 'metadata'
});

export const posts: Post[] = Object.entries(modules)
  .map(([path, metadata]) => {
    const slug = path.split('/').at(-2) ?? '';
    return { ...metadata, slug, url: `/writing/${slug}/`, absoluteUrl: `${SITE_URL}/writing/${slug}/` };
  })
  .sort((a, b) => dateOrder(b.date) - dateOrder(a.date));

/**
 * Drafts are visible while developing, and when a preview build opts in with
 * `VITE_INCLUDE_DRAFTS=true`, which is how the end-to-end tests reach them.
 */
const includeDrafts = import.meta.env.DEV || import.meta.env.VITE_INCLUDE_DRAFTS === 'true';

/**
 * Posts listed in the index. A production build lists no drafts, so nothing
 * links to them and they are never prerendered — a draft cannot be deployed.
 */
export const visiblePosts = includeDrafts ? posts : posts.filter((post) => !post.draft);

/** Posts for the feed and sitemap. Drafts are excluded even while developing. */
export const publishedPosts = posts.filter((post) => !post.draft);
