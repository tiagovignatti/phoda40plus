/* Phoda 40+: funciona sem rede e se atualiza sozinho.
   Estratégia: responde na hora com o que está guardado e, em paralelo,
   busca a versão nova. Se o index.html mudou, avisa a página aberta. */
const CACHE = 'phoda40plus-v1';
const BASE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BASE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

const assinatura = (r) => (r && (r.headers.get('etag') || r.headers.get('last-modified'))) || '';

/* A busca na rede pode terminar antes de a página estar pronta para ouvir.
   Por isso o aviso vale dos dois jeitos: o worker avisa quem já está aberto
   e também responde quando a página pergunta. */
let novidade = false;

async function avisar() {
  const janelas = await self.clients.matchAll({ type: 'window' });
  janelas.forEach((j) => j.postMessage({ tipo: 'versao-nova' }));
}

self.addEventListener('message', (e) => {
  if (e.data && e.data.tipo === 'ha-novidade' && novidade && e.source) {
    e.source.postMessage({ tipo: 'versao-nova' });
  }
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const ePagina = req.mode === 'navigate';
  if (ePagina) novidade = false;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const guardado = await cache.match(req, { ignoreSearch: true });

    const daRede = fetch(url.href, { cache: 'no-cache' }).then(async (novo) => {
      if (novo && novo.ok) {
        const mudou = guardado && assinatura(guardado) && assinatura(novo) && assinatura(guardado) !== assinatura(novo);
        await cache.put(req, novo.clone());
        if (ePagina && mudou) { novidade = true; avisar(); }
      }
      return novo;
    }).catch(() => null);

    if (guardado) { e.waitUntil(daRede); return guardado; }
    const novo = await daRede;
    return novo || new Response('Sem rede e sem cópia guardada.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});
