self.addEventListener('push', (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'طلب جديد من 5DER',
      body: event.data
        ? event.data.text()
        : 'وصل طلب جديد إلى الداشبورد'
    };
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'طلب جديد من 5DER',
      {
        body: data.body || 'وصل طلب جديد إلى الداشبورد',
        tag: data.tag || '5der-order',
        renotify: true,
        data: {
          url: data.url || '/'
        }
      }
    )
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(
          event.notification.data?.url || '/'
        );
      }
    })
  );
});
