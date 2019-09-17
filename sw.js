let CACHE_NAME = 'v-0.0.3'
const urls_to_cache = [
    '/',
    '/request',
    '/static/js/axios.min.js',
    '/static/js/index.js',
    '/static/css/index.css',
    '/static/img/icons/icon-72x72.png',
    '/static/img/icons/icon-96x96.png',
    '/static/img/icons/icon-128x128.png',
    '/static/img/icons/icon-144x144.png',
    '/static/img/icons/icon-152x152.png',
    '/static/img/icons/icon-192x192.png',
    '/static/img/icons/icon-384x384.png',
    '/static/img/icons/icon-512x512.png',
    '/static/img/cripto_moedas.webp',
    '/static/img/fav_icon.ico'
]

self.addEventListener('install', event => {
    // Instala o serviceworker e adiciona os arquivos ao cache
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Abriu o cahce: ' + CACHE_NAME)
                return cache.addAll(urls_to_cache)
            })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response)
                    return response
                return fetch(event.request)
            })
    )
})

this.addEventListener('activate', function (event) {
    var cacheWhitelist = [CACHE_NAME]

    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    return caches.delete(key)
                }
            }))
        })
    )
})