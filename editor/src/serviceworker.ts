/* eslint-disable no-restricted-globals */
const cName = 'editor-cache';
const toCache = [
  '.',
  './index.html',
  './index.css',
  './index.js',
  './manifest.json',
  '',
];

// @ts-ignore
self.addEventListener('install', (event: Event & {waitUntil: () => void}) => {
  // Perform install steps
  event.waitUntil(
    caches.open(cName)
      .then((cache) => cache.addAll(toCache)),
  );
});

self.addEventListener('fetch', (event: Event) => {
  // @ts-ignore
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});
