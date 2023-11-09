import { useUserStore } from '@/contexts/user.store';
import { router } from '@/lib/api';
import { urlBase64ToUint8Array } from '@/lib/utils';
import { useCallback, useEffect } from 'react';

export default function ServiceWorker() {
  const userId = useUserStore((state) => state.user?.id);

  const register = useCallback(async () => {
    try {
      if (!userId) return;
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        // Get the server's public key
        const response = await router.user.getVapidPublicKey(undefined);
        // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
        // urlBase64ToUint8Array() is defined in /tools.js
        const convertedVapidKey = urlBase64ToUint8Array(
          response.vapidPublicKey,
        );

        // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
        // send notifications that don't have a visible effect for the user).
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }
      await router.user.subscribe({
        subscription,
        userId,
      });
    } catch (err) {
      console.error(err);
    }
  }, [userId]);

  useEffect(() => {
    register();
  }, [register]);

  useEffect(() => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  return <></>;
}
