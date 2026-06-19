"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { isNativePlatform } from '@/utils/platform';
import { initNativeGoogleAuth } from '@/services/native-auth';
import { initPushNotifications, registerPushListeners, registerTokenWithBackend } from '@/services/push-notifications';
import { initAppLifecycle } from '@/services/app-lifecycle';
import { getCookie } from '@/utils/auth';
import { getApiUrl } from '@/config/api';

/**
 * Hook to initialize all mobile-specific features.
 * Should be called once at the app root level.
 * 
 * Initializes:
 * - Native Google Auth
 * - Push Notifications (FCM)
 * - App lifecycle (back button, status bar, keyboard)
 * - Network monitoring
 */
export default function useMobileInit() {
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (!isNativePlatform() || initialized.current) return;
    initialized.current = true;

    const init = async () => {
      // 1. Initialize native Google Auth
      await initNativeGoogleAuth();

      // 2. Initialize app lifecycle (back button, status bar, keyboard)
      const cleanupLifecycle = initAppLifecycle(router);

      // 3. Initialize push notifications
      const fcmToken = await initPushNotifications();

      if (fcmToken) {
        // Register token with backend if user is logged in
        const userId = getCookie('learner_id') || getCookie('volunteer_id');
        if (userId) {
          await registerTokenWithBackend(fcmToken, userId, getApiUrl());
        }
      }

      // 4. Register push notification listeners
      registerPushListeners(
        // On notification received in foreground
        (notification) => {
          console.log('[Mobile] Foreground notification:', notification.title);
        },
        // On notification tapped
        (notification) => {
          console.log('[Mobile] Notification tapped:', notification.data);
          // Navigate based on notification data
          if (notification.data?.route) {
            router.push(notification.data.route);
          }
        }
      );

      // Return cleanup
      return cleanupLifecycle;
    };

    let cleanup: (() => void) | undefined;
    init().then((c) => { cleanup = c; });

    return () => {
      cleanup?.();
    };
  }, [router]);
}
