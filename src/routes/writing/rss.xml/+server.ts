import { BRAND_NAME, SITE_URL } from '@timkpaine/ui';
import { publishedPosts, toRfc822 } from '$lib/posts';
import type { RequestHandler } from './$types';

export const prerender = true;

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: RequestHandler = () => {
  const items = publishedPosts
    .map(
      (post) => `<item>
      <title>${escapeXml(post.title)}</title>
      <link>${post.absoluteUrl}</link>
      <guid isPermaLink="true">${post.absoluteUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${toRfc822(post.date)}</pubDate>
    </item>`
    )
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BRAND_NAME)} — Writing</title>
    <link>${SITE_URL}/writing/</link>
    <description>Notes on software, open source, data systems, and the work around them.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/writing/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
