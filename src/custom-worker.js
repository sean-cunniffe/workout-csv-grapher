importScripts('./ngsw-worker.js');
// self.addEventListener('fetch', event => {
//   console.log('hello from worker');
//   // If this is an incoming POST request for the
//   // registered "action" URL, respond to it.
//   if (event.request.method === 'POST') {
//     event.respondWith((async () => {
//       const formData = await event.request.file;
//       const files = formData.get('files') || [];
//       postMessage(files[0])
//     }));
//   } else {
//     return Response.redirect('/hello', 303);
//   }
// });
self.addEventListener('fetch', event => {
  console.log('fetch event');
  console.log(event);
})
self.addEventListener('sync', event => {
  console.log('sync event');
  console.log(event);
})
self.addEventListener('push', event => {
  console.log('push event');
  console.log(event);
})
// function getBase64(file) {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   });
// }