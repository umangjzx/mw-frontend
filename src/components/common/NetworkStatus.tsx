"use client";

import { useEffect, useState } from 'react';
import { isNativePlatform } from '@/utils/platform';
import { getNetworkStatus, onNetworkChange } from '@/services/network';

/**
 * Network Status Banner.
 * Shows a banner when the device goes offline.
 * Only active on native platforms.
 */
export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isNativePlatform()) return;

    // Check initial status
    getNetworkStatus().then((status) => {
      setIsOnline(status.connected);
      if (!status.connected) setShowBanner(true);
    });

    // Listen for changes
    const unsubscribe = onNetworkChange((status) => {
      setIsOnline(status.connected);
      if (!status.connected) {
        setShowBanner(true);
      } else {
        // Show "back online" briefly, then hide
        setTimeout(() => setShowBanner(false), 3000);
      }
    });

    return unsubscribe;
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] px-4 py-2 text-center text-sm font-medium transition-all duration-300 ${
        isOnline
          ? 'bg-green-500 text-white'
          : 'bg-red-500 text-white'
      }`}
      role="alert"
      aria-live="polite"
    >
      {isOnline ? '✓ Back online' : '⚠ No internet connection'}
    </div>
  );
}
