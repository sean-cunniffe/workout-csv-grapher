let file = undefined;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));

self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      file = formData.get('records');
      return Response.redirect(url, 303);
    })());
  }
});

self.addEventListener('message', (event) =>{
  self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window',
  }).then((clients) => {
    if (clients && clients.length) {
      clients[0].postMessage({type: 'file', file: file});
      file = undefined;
    }
  });
})

// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);
//   if (event.request.method === 'POST') {
//     event.respondWith( (async () =>{
//       const formData = await event.request.formData();
//       const file = formData.get('records');
//       getVersionPort.postMessage({file: file})
//       return Response.redirect(url, 303);
//     })());
//   }
// });

// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);
//   if (event.request.method === 'POST') {
//     event.respondWith( (async () =>{
//       const formData = await event.request.formData();
//       const file = formData.get('records');
//       const toBase64 = file => new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//       });
//       const urlNew = url+ await toBase64(file);
//       return Response.redirect(urlNew, 303);
//     })());
//   }
// });
// importScripts('./ngsw-worker.js');

