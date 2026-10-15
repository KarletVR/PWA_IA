/* ============================================================
   SERVICE WORKER — CBTis 260 | Inteligencia Artificial
   Usa la API Cache con 4 métodos/estrategias documentadas abajo.
   ============================================================ */

// Cambia la versión (v1 → v2) cada vez que modifiques el sitio:
// así el "activate" borra la caché vieja y se descargan archivos nuevos.
const VERSION = "v3";
const C_BASE = `ia-base-${VERSION}`;       // archivos esenciales (precaché)
const C_IMG  = `ia-imagenes-${VERSION}`;   // imágenes (cache first)
const C_EXT  = `ia-externos-${VERSION}`;   // CDN, modelo de Teachable Machine
const ACTUALES = [C_BASE, C_IMG, C_EXT];
const MAX_IMAGENES = 60;                   // límite de imágenes guardadas

// Archivos mínimos para que el sitio abra sin internet.
// OJO: si falta UNO solo, addAll falla; por eso las fotos van por caché dinámica.
const BASE = [
  "./", "./index.html", "./que-es-la-ia.html", "./glosario.html", "./aplicaciones.html",
  "./ventajas-y-desafios.html", "./ia-y-educacion.html", "./reconocimiento.html",
  "./offline.html", "./manifest.json", "./css/estilos.css", "./css/reconocimiento.css",
  "./js/main.js", "./js/modelo.js", "./imagenes/logo.png", "./imagenes/robot.png",
  "./imagenes/icons/icon-192.png", "./imagenes/icons/icon-512.png"
];
// Dominios externos que sí se guardan (librerías y modelo de IA).
const EXTERNOS = ["cdn.jsdelivr.net", "teachablemachine.withgoogle.com", "storage.googleapis.com"];

/* INSTALL: se ejecuta al instalar el SW. Aquí se hace el PRECACHÉ. */
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(C_BASE)                        // MÉTODO 1: caches.open → abre/crea la caché
      .then(c => c.addAll(BASE))               // MÉTODO 2: cache.addAll → descarga y guarda la lista
  );
  self.skipWaiting();                          // se activa sin esperar
});

/* ACTIVATE: limpieza de cachés de versiones anteriores. */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(nombres =>              // MÉTODO 3: caches.keys → lista todas las cachés
      Promise.all(nombres.filter(n => !ACTUALES.includes(n))
                         .map(n => caches.delete(n)))  // MÉTODO 4: caches.delete → borra las viejas
    )
  );
  self.clients.claim();                        // controla las pestañas abiertas ya
});

/* ---------- ESTRATEGIAS ---------- */

// ESTRATEGIA A — CACHE FIRST (primero caché).
// Para: imágenes locales, que casi no cambian. Rápido y funciona offline.
async function cacheFirst(req) {
  const guardado = await caches.match(req);    // MÉTODO 5: caches.match → busca en caché
  if (guardado) return guardado;
  const resp = await fetch(req);
  if (resp.ok) {
    const c = await caches.open(C_IMG);
    c.put(req, resp.clone());                  // MÉTODO 6: cache.put → guarda la respuesta
    limitar(C_IMG, MAX_IMAGENES);
  }
  return resp;
}

// ESTRATEGIA B — NETWORK FIRST (primero red).
// Para: páginas HTML, así siempre ves la versión más nueva; si no hay
// internet usa la copia guardada, y si tampoco hay, muestra offline.html.
async function networkFirst(req) {
  try {
    const resp = await fetch(req);
    const c = await caches.open(C_BASE);
    c.put(req, resp.clone());
    return resp;
  } catch (_) {
    return (await caches.match(req)) || caches.match("./offline.html");
  }
}

// ESTRATEGIA C — STALE-WHILE-REVALIDATE (caché ya, y actualiza detrás).
// Para: CSS, JS, librerías CDN y modelo de Teachable Machine.
// Responde al instante con lo guardado y refresca la copia en segundo plano.
async function staleWhileRevalidate(req, nombre) {
  const c = await caches.open(nombre);
  const guardado = await c.match(req);
  const red = fetch(req).then(resp => {
    if (resp.ok || resp.type === "opaque") c.put(req, resp.clone());
    return resp;
  }).catch(() => guardado);
  return guardado || red;
}

// LIMITAR CACHÉ: evita que crezca sin control borrando lo más antiguo.
async function limitar(nombre, max) {
  const c = await caches.open(nombre);
  const claves = await c.keys();               // MÉTODO 7: cache.keys → lista entradas
  if (claves.length > max) {
    await c.delete(claves[0]);                 // MÉTODO 8: cache.delete → borra una entrada
    limitar(nombre, max);
  }
}

/* FETCH: decide qué estrategia usar según el tipo de recurso. */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (req.mode === "navigate" || req.destination === "document")
      return e.respondWith(networkFirst(req));                 // páginas
    if (req.destination === "image")
      return e.respondWith(cacheFirst(req));                   // imágenes
    return e.respondWith(staleWhileRevalidate(req, C_BASE));   // css, js, json
  }
  if (EXTERNOS.includes(url.hostname))
    e.respondWith(staleWhileRevalidate(req, C_EXT));           // CDN y modelo IA
  // YouTube y lo demás: pasan directo a la red.
});
