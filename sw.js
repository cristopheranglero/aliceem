/* Service worker: guarda toda la app en el dispositivo para usarla sin internet. */
// VERSION y ARCHIVOS los llena vite.config.js al compilar.
const VERSION = "80a1e262f4e8";
const ARCHIVOS = [
 "./",
 "./assets/_commonjsHelpers-Cpj98o6Y.js",
 "./assets/bricolage-grotesque-latin-ext-opsz-normal-IcJDqblK.woff2",
 "./assets/bricolage-grotesque-latin-opsz-normal-Cre6nC2_.woff2",
 "./assets/bricolage-grotesque-vietnamese-opsz-normal-D9N6E8K1.woff2",
 "./assets/figtree-latin-400-normal-BD4aNku5.woff",
 "./assets/figtree-latin-400-normal-g7Dtegnw.woff2",
 "./assets/figtree-latin-500-normal-BWnGEVsr.woff2",
 "./assets/figtree-latin-500-normal-B_yy1phn.woff",
 "./assets/figtree-latin-600-normal-BM_oTo4n.woff",
 "./assets/figtree-latin-600-normal-Cv_xCTDl.woff2",
 "./assets/figtree-latin-700-normal-BCCt2T1q.woff",
 "./assets/figtree-latin-700-normal-th6qEP7c.woff2",
 "./assets/figtree-latin-ext-400-normal-CXAzuTZb.woff2",
 "./assets/figtree-latin-ext-400-normal-Gbh-3PTk.woff",
 "./assets/figtree-latin-ext-500-normal-BOEJvrb_.woff",
 "./assets/figtree-latin-ext-500-normal-Du0rIuHj.woff2",
 "./assets/figtree-latin-ext-600-normal-CQqsimlV.woff",
 "./assets/figtree-latin-ext-600-normal-DJlfifZj.woff2",
 "./assets/figtree-latin-ext-700-normal-BoDi4KL2.woff",
 "./assets/figtree-latin-ext-700-normal-CS4sQkGV.woff2",
 "./assets/index-B8vLbhuF.js",
 "./assets/index-CxQnSOPv.js",
 "./assets/index-yEMcSXBy.css",
 "./assets/jszip.min-Dw6D-vak.js",
 "./iconos/apple-touch-icon.png",
 "./iconos/favicon-32.png",
 "./iconos/icono-192.png",
 "./iconos/icono-512.png",
 "./iconos/icono-maskable-512.png",
 "./index.html",
 "./manifest.webmanifest"
];
const CACHE = "aliceem-" + VERSION;

// Instala la versión nueva completa; si falta un archivo, no se instala y sigue la anterior.
self.addEventListener("install", e => {
  // "reload": pide cada archivo al servidor, no a la caché del navegador (si no, una versión
  // nueva podría guardar el index.html anterior, que apunta a archivos que ya no existen).
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS.map(u => new Request(u, { cache: "reload" })))));
});

// Al activarse borra las versiones viejas. Los datos (IndexedDB) no se tocan.
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith("aliceem-") && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

// La página decide cuándo pasar a la versión nueva (cuando no hay nada a medio escribir).
self.addEventListener("message", e => { if (e.data === "activar") self.skipWaiting(); });

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;          // la nube de sincronización va directo
  if (r.mode === "navigate") {
    e.respondWith(caches.open(CACHE).then(c => c.match("./index.html", { ignoreVary: true })).then(x => x || fetch(r)));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c => c.match(r, { ignoreSearch: true, ignoreVary: true })).then(x => x || fetch(r)));
});
