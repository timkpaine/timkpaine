import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: '404.html',
      precompress: true,
      strict: true
    }),
    files: {
      assets: 'public'
    },
    prerender: {
      entries: ['*']
    }
  }
};

export default config;
