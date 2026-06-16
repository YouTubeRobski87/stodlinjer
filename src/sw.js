const CACHE_VERSION = 'stodlinjer-pwa-v2';
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

const SHELL_URLS = [
  '/',
  '/offline/',
  '/assets/css/tailwind-built.css',
  '/assets/js/app.js',
  '/assets/js/chatbot.js',
  '/assets/js/analytics.js',
  '/assets/vendor/speed-insights.js',
  '/assets/favicon/site.webmanifest',
  '/assets/favicon/favicon.svg',
  '/assets/favicon/favicon-96x96.png',
  '/assets/favicon/apple-touch-icon.png',
  '/assets/favicon/web-app-manifest-192x192.png',
  '/assets/favicon/web-app-manifest-512x512.png',
  '/assets/symbols/st-line.svg',
  '/assets/symbols/st-solid.svg',
  '/data/icons.json'
];

const STATIC_PAGE_URLS = [
  '/',
  '/offline/',
  '/artiklar/',
  '/samlingar/',
  '/kontakt/',
  '/samlingar/faq/',
  '/samlingar/fakta-myter/',
  '/samlingar/fordjupning/',
  '/samlingar/handlingsguider/'
];

const ASSET_DESTINATIONS = new Set(['style', 'script', 'font', 'image']);
const ASSET_EXTENSIONS = /\.(?:css|js|mjs|json|woff2?|ttf|eot|svg|png|jpg|jpeg|webp|ico)$/i;

async function cacheOkResponse(cacheName, request) {
  try {
    const response = await fetch(request, { cache: 'reload' });
    if (!response.ok || response.redirected || response.type !== 'basic') {
      return;
    }
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
  } catch (error) {
    // Precache opportunistically; runtime strategies handle offline misses.
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      ...SHELL_URLS.map((url) => cacheOkResponse(ASSET_CACHE, new Request(url))),
      ...STATIC_PAGE_URLS.map((url) => cacheOkResponse(PAGE_CACHE, new Request(url)))
    ]).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('stodlinjer-pwa-') && ![PAGE_CACHE, ASSET_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

function isSameOrigin(request) {
  return new URL(request.url).origin === self.location.origin;
}

function isHtmlRequest(request) {
  return request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html');
}

function isAssetRequest(request) {
  const url = new URL(request.url);
  return ASSET_DESTINATIONS.has(request.destination) || ASSET_EXTENSIONS.test(url.pathname);
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok && !response.redirected && response.type === 'basic') {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return (await cache.match(request)) || (await cache.match('/offline/'));
  }
}

async function cacheFirstAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok && !response.redirected && response.type === 'basic') {
    const cache = await caches.open(ASSET_CACHE);
    await cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || !isSameOrigin(request) || url.pathname.startsWith('/api/')) {
    return;
  }

  if (isHtmlRequest(request)) {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (isAssetRequest(request)) {
    event.respondWith(cacheFirstAsset(request));
  }
});
