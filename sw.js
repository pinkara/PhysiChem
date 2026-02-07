// Service Worker pour PhysiChem PWA
const CACHE_NAME = 'physichem-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Vérifier si une requête est valide pour le cache
function isCacheableRequest(request) {
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP(S)
  if (!url.protocol.startsWith('http')) {
    return false;
  }
  
  // Ignorer les requêtes Supabase
  if (url.hostname.includes('supabase.co')) {
    return false;
  }
  
  // Ignorer les méthodes autres que GET
  if (request.method !== 'GET') {
    return false;
  }
  
  return true;
}

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache ouvert');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => console.error('[SW] Erreur cache:', err))
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Stratégie de cache : Network First, puis Cache
self.addEventListener('fetch', (event) => {
  // Ignorer immédiatement les requêtes non valides
  if (!isCacheableRequest(event.request)) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les requêtes réussies
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Double vérification avant de mettre en cache
            if (isCacheableRequest(event.request)) {
              cache.put(event.request, responseClone).catch((err) => {
                // Ignorer silencieusement les erreurs de cache
                console.log('[SW] Cache put skipped:', err.message);
              });
            }
          });
        }
        return response;
      })
      .catch(() => {
        // En cas d'erreur réseau, utiliser le cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si pas dans le cache, retourner la page offline
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
