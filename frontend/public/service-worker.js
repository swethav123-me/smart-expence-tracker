// Service Worker for Smart Expense Tracker PWA
// Enables offline support and caching

const CACHE_NAME = 'smart-expense-tracker-v1'
const RUNTIME_CACHE = 'smart-expense-tracker-runtime'

// URLs to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
]

// Install event - cache core files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell')
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        console.log('Service Worker installed')
        self.skipWaiting()
      })
      .catch((error) => {
        console.error('Installation failed:', error)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker activated')
        self.clients.claim()
      })
  )
})

// Fetch event - network first, cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Skip API calls - let them handle their own caching
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return offline page or cached response
          return caches.match(request)
            .then(response => response || new Response('Offline - No cached data available', { status: 503 }))
        })
    )
    return
  }
  
  // Network first for HTML pages
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response before caching
          const responseToCache = response.clone()
          
          caches.open(RUNTIME_CACHE)
            .then((cache) => {
              cache.put(request, responseToCache)
            })
          
          return response
        })
        .catch(() => {
          // Fallback to cache
          return caches.match(request)
            .then(response => response || caches.match('/'))
        })
    )
    return
  }
  
  // Cache first for assets (images, css, js)
  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return from cache if available
        if (response) {
          return response
        }
        
        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response
            }
            
            // Clone and cache successful response
            const responseToCache = response.clone()
            
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache)
              })
            
            return response
          })
          .catch(() => {
            // Return offline fallback if available
            return caches.match('/')
          })
      })
  )
})

// Handle messages from clients
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data)
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Push notifications (for future enhancement)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Smart Expense Tracker'
  const options = {
    body: data.body || 'New notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.data || {},
  }
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Periodic background sync (for future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-expenses') {
    event.waitUntil(
      // Implement sync logic here
      Promise.resolve()
    )
  }
})

console.log('Service Worker script loaded')
