"use client";

export const simulatePush = (title: string, body: string, url: string = "/overview") => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        icon: "/favicon.png",
        badge: "/favicon.png",
        data: { url },
        vibrate: [100, 50, 100],
      });
    });
  }
};
