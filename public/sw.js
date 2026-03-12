/* eslint-disable no-console */
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "DentiSpark", body: "New notification from DentiSpark!" };

  const options = {
    body: data.body,
    icon: "/favicon.png",
    badge: "/favicon.png",
    data: {
      url: data.url || "/overview",
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "View Details" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open") {
    const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
    
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
    );
  }
});
