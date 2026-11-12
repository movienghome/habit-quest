// 습관 퀘스트 service worker: 기기 사본으로 바로 열고, 파일은 뒤에서 새로 받아요.
const BETA = self.location.pathname.includes('/beta/');
const PRE = BETA ? 'hqb-' : 'hq-';
const VERSION = PRE + '2026-11-12-v78';
const EXT = VERSION + '-ext';
const SHELL = ['./', './index.html', './backend.js', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png', './icons/favicon.ico'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PRE) && k !== VERSION && k !== EXT).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

async function staleWhileRevalidate(req, key) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(key || req, { ignoreSearch: true });
  const net = fetch(req).then(res => { if (res && res.ok) cache.put(key || req, res.clone()); return res; }).catch(() => null);
  return hit || (await net) || new Response('오프라인', { status: 503 });
}
async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try { const res = await fetch(req, { cache: 'no-store' }); if (res.ok) cache.put(req, res.clone()); return res; }
  catch (e) { return (await cache.match(req, { ignoreSearch: true })) || new Response('', { status: 503 }); }
}
async function navFirst(req) {
  const cache = await caches.open(VERSION);
  const net = fetch(req, { cache: 'no-store' }).then(res => { if (res && res.ok) cache.put('./index.html', res.clone()); return res; }).catch(() => null);
  const slow = new Promise(r => setTimeout(() => r('slow'), 3500));
  const first = await Promise.race([net, slow]);
  if (first && first !== 'slow') return first;
  return (await cache.match('./index.html', { ignoreSearch: true })) || (await net) || new Response('오프라인', { status: 503 });
}
async function cacheFirst(req) {
  const cache = await caches.open(EXT);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    if (!BETA && url.pathname.startsWith(new URL('./beta/', self.location).pathname)) return;  // 베타는 자기 worker가 따로 있어요
    if (url.pathname.endsWith('/config.js')) { e.respondWith(networkFirst(req)); return; }
    if (req.mode === 'navigate') { e.respondWith(navFirst(req)); return; }  // 새 버전이 바로 열리게(옛 버전이 한 번 더 도는 일 없음), 느리면 기기 사본
    if (url.pathname.endsWith('/index.html') || url.pathname.endsWith('/backend.js')) { e.respondWith(networkFirst(req)); return; }
    e.respondWith(staleWhileRevalidate(req)); return;
  }
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) { e.respondWith(cacheFirst(req)); return; }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { e.respondWith(cacheFirst(req)); return; }
});
