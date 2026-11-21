/* GCHE2: funcionamiento sin internet y actualizaciones */
const VERSION = 'gche2-1.2.0';
const SHELL = ['./', './index.html', './manifest.webmanifest', './consultas.css', './consultas.js', './consultas-esquema.js', './nube.js', './firebase-config.js', './herramientas-datos.js', './herramientas.js', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-48.png'];
const FONTS = 'gche2-fuentes';
const LIBS = 'gche2-librerias';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== FONTS && k !== LIBS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('message', e => {
  if (e.data === 'actualizar') self.skipWaiting();
});

const cacheFirst = (name, req) => caches.open(name).then(async c => {
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r.ok) c.put(req, r.clone());
  return r;
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  /* librerías de Firebase: la dirección lleva la versión, así que se guardan una vez */
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith(cacheFirst(LIBS, req));
    return;
  }
  if (url.origin !== location.origin) return;
  /* archivos de la app: primero la red para que todo llegue de la misma versión; sin internet, la copia guardada */
  const key = req.mode === 'navigate' ? './index.html' : req;
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const copy = r.clone(); caches.open(VERSION).then(c => c.put(key, copy)); }
    return r;
  }).catch(() => caches.match(key, { ignoreSearch: true }).then(hit => hit || caches.match('./index.html'))));
});
