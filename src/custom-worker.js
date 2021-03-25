let file = undefined;

/**
 * Checks for a post request (file being sent from share API)
 * saves the file
 */
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

/**
 * receives message from app that its ready to receive file
 * send file to app
 */
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

importScripts('./ngsw-worker.js');

