// Card Vault service worker — caches the app so it works offline at the pop-up
const CACHE = "card-vault-v2";
const SHELL = [
  "./index.html",
  "./scanner.html",
  "./database.html",
  "./logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // live data (card database API) is always network-only
  if(url.hostname.includes("pokemontcg.io")) return;
  const isPage = e.request.mode === "navigate" || (e.request.destination === "document");
  if(isPage){
    // pages: network FIRST so inventory updates show up; cache is the offline fallback
    e.respondWith(
      fetch(e.request).then(res => {
        if(res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // images and other assets: cache first (they never change once uploaded)
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if(e.request.method === "GET" && res.ok && url.origin === location.origin){
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
