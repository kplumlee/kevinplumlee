const CACHE_NAME = 'kevin-plumlee-v3.4';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/dist/css/all.min.css',
    '/dist/js/all.min.js',
    '/images/icons/plum.svg',
    '/images/profilepicture/Kevin_Plumlee.webp',
    '/images/wallpapers/greece.webp',
    '/images/wallpapers/gameofthrones.webp',
    '/images/wallpapers/Colleseum.webp',
    '/images/wallpapers/Colluseum2.webp',
    '/images/wallpapers/Coluseum3.webp',
    '/images/wallpapers/CorfuGreece.webp',
    '/images/wallpapers/CorfuGreece2.webp',
    '/images/wallpapers/Rome.webp',
    '/images/wallpapers/Hawaii.webp',
    '/images/wallpapers/CroatiaBeach.webp',
    '/images/wallpapers/ColoradoSprings.webp',
    '/images/wallpapers/OceanCityMD.webp',
    '/content/about.html',
    '/content/resume.html',
    '/content/contact.html',
    '/content/trivia.html',
    '/js/trivia.js',
    '/css/trivia.css',
    '/content/calculator.html',
    '/js/calculator.js',
    '/css/calculator.css',
    '/favicon.svg',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip non-GET requests and external requests
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Return cached version
                    return response;
                }

                // Not in cache, fetch from network
                return fetch(event.request)
                    .then(fetchResponse => {
                        // Check if valid response
                        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                            return fetchResponse;
                        }

                        // Clone the response
                        const responseToCache = fetchResponse.clone();

                        // Add to dynamic cache
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return fetchResponse;
                    })
                    .catch(() => {
                        // Network failed, return offline page if available
                        if (event.request.destination === 'document') {
                            return caches.match('/');
                        }
                    });
            })
    );
});

// Background sync for analytics and form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    return new Promise((resolve) => {
        // Perform any background sync operations
        console.log('Service Worker: Background sync completed');
        resolve();
    });
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
    if (event.data) {
        const options = {
            body: event.data.text(),
            icon: '/images/icons/plum.svg',
            badge: '/images/icons/plum.svg',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            }
        };
        
        event.waitUntil(
            self.registration.showNotification('Kevin Plumlee', options)
        );
    }
});

// Message handling for cache updates
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({version: CACHE_NAME});
    }
}); 