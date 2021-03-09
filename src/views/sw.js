self.addEventListener('install', event => {
   // console.log('service worker installed')
});

self.addEventListener('activate', event => {
   // console.log('service worker has been activated');
})

self.addEventListener('fetch', evt => {
   // console.log('fetch event', evt);
}) 