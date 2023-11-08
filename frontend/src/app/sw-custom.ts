/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference lib="webworker" />
declare const localforage: any;
const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis;
self.importScripts(
  'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js',
);

// sw.addEventListener('install', () => {
//   console.log('Installing service worker...');
// });

// Register event listener for the 'push' event.
sw.addEventListener('push', function (event) {
  // Retrieve the textual payload from event.data (a PushMessageData object).
  // Other formats are supported (ArrayBuffer, Blob, JSON), check out the documentation
  // on https://developer.mozilla.org/en-US/docs/Web/API/PushMessageData.
  const payload = event.data
    ? (JSON.parse(event.data.text()) as {
        title: string;
        body: string;
        icon: string;
      })
    : null;
  if (payload) {
    console.log('Received a push message', payload);
    // Keep the service worker alive until the notification is created.
    event.waitUntil(
      // Show a notification with title 'ServiceWorker Cookbook' and use the payload
      // as the body.
      sw.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon,
      }),
    );
  }
});
