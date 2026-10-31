const C='sonora-v1',A=['./','./index.html','./app.js','./style.css','./manifest.webmanifest','./icon-192.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(A))));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin||false)return;
e.respondWith(fetch(e.request).catch(()=>caches.match(e.request).then(r=>r||caches.match('./'))));});
