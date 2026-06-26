import { isNativePlatform } from '@/utils/platform';

/**
 * Runtime API configuration for MelodyWings.
 * 
 * On web: Uses NEXT_PUBLIC_API_URL (baked at build time by Next.js)
 * On native mobile: Uses hardcoded production URL since process.env
 * is baked at build time and we want the mobile app to always hit prod.
 */

// Production API URL - used by the mobile app
// The backend is at api.melodywings.org (FastAPI on port 8080)
const PRODUCTION_API_URL = 'https://api.melodywings.org';

/** Get the base API URL based on current platform */
export const getApiBaseUrl = (): string => {
  if (isNativePlatform()) {
    return PRODUCTION_API_URL;
  }
  // On web, use the env variable (standard Next.js behavior)
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
};

/** Get the full API v1 URL */
export const getApiUrl = (): string => {
  return `${getApiBaseUrl()}/api/v1`;
};
