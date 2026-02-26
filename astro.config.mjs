// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      headers: {
        'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;",
      },
    },
  },
  redirects: {
    // Old WordPress URLs → new Astro routes
    '/rates/': '/course-info/rates/',
    '/course-info/mobile-apps/': '/course-info/mobile-app/',
    '/directions-address/': '/course-info/directions/',
    '/monday-ladies-league/': '/leagues/monday-ladies/',
    '/tuesday-league/': '/leagues/tuesday-mens/',
    '/grand-view-wednesday-mens-league/': '/leagues/wednesday-mens/',
    '/fall-league/': '/leagues/fall/',
    '/contact-us/': '/contact/',
  },
});
