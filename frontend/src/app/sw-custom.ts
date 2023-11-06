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

// Function to check passive income status and notify the user
async function checkPassiveIncomeStatus() {
  const lastBalance = await localforage.getItem('lastBalance');
  const lastBalanceTime = await localforage.getItem('lastBalanceTime');
  const maxPassiveIncomeInterval = await localforage.getItem(
    'maxPassiveIncomeInterval',
  );

  if (lastBalance && lastBalanceTime && maxPassiveIncomeInterval) {
    const currentTime = new Date().getTime();
    const lastTime = parseInt(lastBalanceTime, 10);
    const interval = parseInt(maxPassiveIncomeInterval, 10);

    const notificationSent = await localforage.getItem('notificationSent');
    if (currentTime - lastTime >= interval && !notificationSent) {
      // Passive income has stopped, notify the user
      sw.registration.showNotification('Claim your rewards!', {
        body: 'Your passive income has stopped. Please check your account.',
        icon: '/manifest-icon-512.maskable.png',
        vibrate: [200, 100, 200],
      });
      localforage.setItem('notificationSent', true);
    } else if (currentTime - lastTime < interval && notificationSent) {
      localforage.setItem('notificationSent', false);
    }
  }
}

// Schedule the check to run every minute (60,000 milliseconds)
setInterval(checkPassiveIncomeStatus, 10000);

sw.addEventListener('message', (event) => {
  if (event.data.kind === 'save') {
    localforage.setItem('lastBalance', event.data.lastBalance);
    localforage.setItem('lastBalanceTime', event.data.lastBalanceTime);
    localforage.setItem(
      'maxPassiveIncomeInterval',
      event.data.maxPassiveIncomeInterval,
    );
  }
});
