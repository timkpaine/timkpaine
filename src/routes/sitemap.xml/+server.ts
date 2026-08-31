import { SITE_URL } from '@timkpaine/ui';
import { toIsoDate } from '$lib/dates';
import { publishedPosts } from '$lib/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

const pages = ['', 'talks/', 'writing/'];

export const GET: RequestHandler = () => {
  const staticUrls = pages.map((page) => `<url><loc>${SITE_URL}/${page}</loc></url>`);
  const postUrls = publishedPosts.map(
    (post) => `<url><loc>${post.absoluteUrl}</loc><lastmod>${toIsoDate(post.updated ?? post.date)}</lastmod></url>`
  );

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticUrls, ...postUrls].join('')}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
};
