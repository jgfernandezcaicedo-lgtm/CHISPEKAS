const CACHE = "chispekas-v4";
const ASSETS = [
  "/CHISPEKAS/",
  "/CHISPEKAS/index.html",
  "/CHISPEKAS/chispekas.html",
  "/CHISPEKAS/stak.html",
  "/CHISPEKAS/auto.html",
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap",
  "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);

  // Solo se cachean páginas propias del sitio y los 2 recursos externos
  // listados en ASSETS. TODO lo demás (Firebase, Firestore, Google Auth,
  // etc.) se deja pasar sin tocar — interceptarlo rompía la carga de datos.
  const isOwnPage = url.origin === self.location.origin;
  const isKnownAsset = ASSETS.includes(req.url);
  if (req.method !== "GET" || (!isOwnPage && !isKnownAsset)) {
    return; // no respondWith → la petición sigue su curso normal, sin SW
  }

  e.respondWith(
    fetch(req)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(req, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
