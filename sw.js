const CACHE = 'dinero-v4'
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
  // Network-first: always try to get fresh files, fall back to cache when offline
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})
