"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, getCookie } from '@/utils/auth';
import { isNativePlatform } from '@/utils/platform';

/**
 * Client-side Route Guard for Capacitor mobile app.
 * 
 * Replicates the logic from middleware.ts on the client side,
 * since Next.js middleware doesn't run in static exports.
 * 
 * Only activates on native platforms — web continues using server middleware.
 */

const LANDING_ROUTES = [
  '/',
  '/about-us',
  '/donate',
  '/join-us',
  '/join-us/step-1',
  '/join-us/step-2',
  '/join-us/step-3',
  '/join-us/success',
  '/privacy-policy',
  '/terms-and-conditions',
];

const ALWAYS_ACCESSIBLE = ['/donate', '/privacy-policy', '/terms-and-conditions'];

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(!isNativePlatform());

  useEffect(() => {
    // Web uses server middleware — skip client guard
    if (!isNativePlatform()) {
      setAuthorized(true);
      return;
    }

    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const role = getCookie('role');
      const onboardedStatus = getCookie('onboarded_status');

      // Not authenticated
      if (!authenticated) {
        if (LANDING_ROUTES.includes(pathname)) {
          setAuthorized(true);
        } else {
          router.replace('/');
          setAuthorized(false);
        }
        return;
      }

      // Authenticated but not onboarded
      if (onboardedStatus === 'details_pending' || onboardedStatus === 'partially_filled') {
        if (pathname !== '/onboarding') {
          router.replace('/onboarding');
          setAuthorized(false);
          return;
        }
        setAuthorized(true);
        return;
      }

      // Verification pending
      if (onboardedStatus === 'verification_pending' || onboardedStatus === 'verification_rejected') {
        if (role === 'learner' && pathname !== '/onboarding/verification') {
          router.replace('/onboarding/verification');
          setAuthorized(false);
          return;
        }
        // Volunteers can access private routes while pending
        setAuthorized(true);
        return;
      }

      // Fully verified
      if (onboardedStatus === 'verification_completed') {
        if (ALWAYS_ACCESSIBLE.includes(pathname)) {
          setAuthorized(true);
          return;
        }
        if (LANDING_ROUTES.includes(pathname)) {
          const defaultRoute = role === 'learner'
            ? '/learner/instant-sessions'
            : '/volunteer/schedule';
          router.replace(defaultRoute);
          setAuthorized(false);
          return;
        }
      }

      setAuthorized(true);
    };

    checkAuth();
  }, [pathname, router]);

  if (!authorized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
