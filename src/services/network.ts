import { Network } from '@capacitor/network';
import { isNativePlatform } from '@/utils/platform';

/**
 * Network connectivity monitoring for MelodyWings Mobile.
 * Provides hooks and utilities to detect online/offline state.
 */

export interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

/** Get current network status */
export const getNetworkStatus = async (): Promise<NetworkStatus> => {
  if (!isNativePlatform()) {
    return { connected: navigator.onLine, connectionType: 'unknown' };
  }

  const status = await Network.getStatus();
  return {
    connected: status.connected,
    connectionType: status.connectionType,
  };
};

/** Register a listener for network status changes */
export const onNetworkChange = (
  callback: (status: NetworkStatus) => void
): (() => void) => {
  if (!isNativePlatform()) {
    const onlineHandler = () => callback({ connected: true, connectionType: 'unknown' });
    const offlineHandler = () => callback({ connected: false, connectionType: 'none' });

    window.addEventListener('online', onlineHandler);
    window.addEventListener('offline', offlineHandler);

    return () => {
      window.removeEventListener('online', onlineHandler);
      window.removeEventListener('offline', offlineHandler);
    };
  }

  const listener = Network.addListener('networkStatusChange', (status) => {
    callback({
      connected: status.connected,
      connectionType: status.connectionType,
    });
  });

  return () => {
    listener.then((l) => l.remove());
  };
};
