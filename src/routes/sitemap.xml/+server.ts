import type { RequestHandler } from './$types';

export const prerender = true;

const pages = ['', 'talks/', 'writing/'];

export const GET: RequestHandler = () => {
  const urls = pages
    .map((page) => `<url><loc>https://tim.paine.nyc/${page}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml'
      }
    }
  );
};
