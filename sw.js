const CACHE = 'dinero-v3'
const ASSETS = ['./', './index.html', './app.css', './app.js', './manifest.json', './icon-192.png', './icon-512.png']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.url.includes('api.anthropic.com')) return
  // Network-first for navigation requests so updates are always picked up
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('./index.html'))
    )
    return
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  )
})
