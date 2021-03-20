self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method === 'POST') {
    event.respondWith( (async () =>{
      const formData = await event.request.formData();
      const file = formData.get('records');
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
      const urlNew = url+ await toBase64(file);
      return Response.redirect(urlNew, 303);
    })());
  }
});

// importScripts('./ngsw-worker.js');

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
