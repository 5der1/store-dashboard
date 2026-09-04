self.addEventListener('push', function (event) {
  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    data = {
      title: 'طلب جديد من 5DER',
      body: event.data
        ? event.data.text()
        : 'وصل طلب جديد إلى الداشبورد'
    };
  }

  const title = data.title || 'طلب جديد من 5DER';

  const options = {
    body: data.body || 'وصل طلب جديد إلى الداشبورد',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    tag: data.tag || '5der-order',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function (clientList) {

      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});


self.addEventListener('install', function () {
  self.skipWaiting();
});


self.addEventListener('activate', function (event) {
  event.waitUntil(
    clients.claim()
  );
});
