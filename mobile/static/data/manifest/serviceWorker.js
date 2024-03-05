const CACHE_NAME = "Elite Phones Club";
const RESOURCES = [
  // '/',
  // '{{root}}/static/data/manifest.json',
  // '{{root}}/static/data/serviceWorker.js',
  // ...Array.from({ length: 100 }, (_, i) => `/images/image${i + 1}.jpg`)
];
const noti = {"push":true,"sound":true};//control the notifications

// do stuff which are required for Service-Worker to work smoothly
self.addEventListener('install', event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      // add files so to be offline
      return cache.addAll(RESOURCES);
    })
  );
});//END: install

// do stuff while worker is being activated
self.addEventListener('activate', event => {
   // Add cache names you won't delete
  const keep_k = [CACHE_NAME];

  event.waitUntil(
    // delete old caches
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(k => {
          if (!keep_k.includes(k)) {
            return caches.delete(k);
          }
        })
      );
    }).then(() => {
      // Open the new cache and add/update resources
      return caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(RESOURCES);
      });
    })
  );

  event.waitUntil(
    // send notification
    self.registration.showNotification(title='App Updated!', {
      body: 'The application has been updated with improvements.',
      icon: '{{root}}/static/images/user1.svg'
    })
  );
});//END: activate

// respond with cache or request to internet
self.addEventListener('fetch', event => {
  event.respondWith(
    // open the cache
    caches.open(CACHE_NAME).then(cache => {
      // find the request in cache
      return cache.match(event.request).then(response => {
        
        // return response from cache
        if (response) return response;

        // Not in cache, fetch from network
        return fetch(event.request).then(response => {
          
          // Clone the response and put it in cache
          cache.put(event.request, response.clone());
          return response;
          
        }).catch(error => {
          
          // Handle fetch errors, you can customize this part
          console.error('Fetch error:', error);
          throw error;

          // return new Response("Network error happened", {
          //                     status: 408,
          //                     headers: { "Content-Type": "text/plain" },
          //         });
        });
      });
    })
  );
});//END fetch

// when notification is trying to show
self.addEventListener('push', event=>{
  // don't show notifications
  if (!noti.push) return;
  
  const options = {
    body: event.data.text(),
    // icon: 'images/icon.png',
    // badge: 'images/badge.png',
  };
  if (noti.sound)  options.sound = 'default';// or '/sounds/ting.mp3'
  
  if (Notification.permission === 'granted') {
    // show notification
    event.waitUntil( self.registration.showNotification(title='Congratulations!', options)    );  
  } else console.error('Notification permission not granted.');
  
});//END: push

// when notification is clicked
self.addEventListener('notificationclick', event=>{
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});//END: notificationclick

self.addEventListener("notificationclose", (event) => {
  // Handling notification close
});

// when webpage sends data to the serviceWorker
self.addEventListener('message', e=> {
  // user settings
  if (e.data && e.data.type === 'settings') noti[e.data.id] = e.data.value;
});//END: message

// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation#background_operation
// sync events
self.addEventListener("sync", (event) => {
  if (event.tag === "send-message") {
    event.waitUntil((async ()=>{
      // Logic to send message when sync event fires
    })());
  }
});//END: sync

// Background Fetch
self.addEventListener("backgroundfetchsuccess", (event) => {
  // Handling background fetch success
});

self.addEventListener("backgroundfetchfail", (event) => {
  // Handling background fetch failure
});

self.addEventListener("backgroundfetchabort", (event) => {
  // Handling background fetch abort
});

self.addEventListener("backgroundfetchclick", (event) => {
  // Handling background fetch click
});

// Periodic Background Sync
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-news") {
    event.waitUntil((async ()=>{
        // Logic to update news in the background periodically
    })());
  }
});
