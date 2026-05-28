// public/sw.js
self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'NetCampus Alert';
  const options = {
    body: data.body || 'A network event occurred',
    icon: '/icon.svg',
    badge: '/icon-light-32x32.png',
    tag: data.tag || 'netcampus-alert',
    renotify: true,
    requireInteraction: data.severity === 'critical',
    data: {
      url: data.url || '/alerts',
      severity: data.severity,
    },
    actions: [
      {
        action: 'view',
        title: 'View Dashboard',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/alerts';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // If app is already open, focus it
        for (const client of windowClients) {
          if (client.url.includes('localhost:3000') && 'focus' in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        // Otherwise open new tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});