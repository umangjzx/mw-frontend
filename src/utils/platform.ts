import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utilities for Capacitor mobile app.
 * These utilities allow conditional logic between web and native platforms.
 */

/** Returns true when running inside a native Capacitor shell (Android/iOS) */
export const isNativePlatform = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

/** Returns true when running on Android */
export const isAndroid = (): boolean => {
  try {
    return Capacitor.getPlatform() === 'android';
  } catch {
    return false;
  }
};

/** Returns true when running on iOS */
export const isIOS = (): boolean => {
  try {
    return Capacitor.getPlatform() === 'ios';
  } catch {
    return false;
  }
};

/** Returns true when running as a standard web app */
export const isWeb = (): boolean => {
  try {
    return Capacitor.getPlatform() === 'web';
  } catch {
    return true;
  }
};

/** Get current platform name */
export const getPlatformName = (): 'android' | 'ios' | 'web' => {
  try {
    return Capacitor.getPlatform() as 'android' | 'ios' | 'web';
  } catch {
    return 'web';
  }
};
