# MelodyWings Android App (Capacitor)

## Overview

This is the MelodyWings Android app built with Capacitor wrapping the existing Next.js frontend. The web application continues to work exactly as before — the mobile build is a separate output that doesn't affect production.

## Architecture

```
melody-wings-frontend/
├── src/                    # Shared source code (web + mobile)
├── android/                # Native Android project (Capacitor)
├── out/                    # Static export for mobile (generated)
├── .next/                  # Standard Next.js build (web)
├── capacitor.config.ts     # Capacitor configuration
├── next.config.mobile.mjs  # Mobile-specific Next.js config
├── next.config.mjs         # Web Next.js config (unchanged)
├── next.config.js          # Web Next.js config (unchanged)
└── scripts/
    ├── use-mobile-config.js    # Switches to mobile build mode
    └── restore-web-config.js   # Restores web build mode
```

## Features

| Feature | Status | Plugin |
|---------|--------|--------|
| Google Sign-In (native) | ✅ | @capgo/capacitor-social-login |
| Push Notifications (FCM) | ✅ | @capacitor/push-notifications |
| Local Notifications | ✅ | @capacitor/local-notifications |
| Camera / Gallery | ✅ | @capacitor/camera |
| Network Status | ✅ | @capacitor/network |
| Status Bar Control | ✅ | @capacitor/status-bar |
| Keyboard Management | ✅ | @capacitor/keyboard |
| Splash Screen | ✅ | @capacitor/splash-screen |
| Back Button (Android) | ✅ | @capacitor/app |
| File System Access | ✅ | @capacitor/filesystem |
| In-App Browser | ✅ | @capacitor/browser |
| Haptic Feedback | ✅ | @capacitor/haptics |
| Secure Storage | ✅ | @capacitor/preferences |

## Quick Start

### Prerequisites

1. **Node.js 22+** installed
2. **Android Studio** (latest) with:
   - Android SDK 36 (API level 36)
   - Android Build Tools
   - Android Emulator (or physical device)
3. **Java 17+** (bundled with Android Studio)

### Build & Run

```bash
# 1. Install dependencies
npm install

# 2. Build for mobile (creates static export in /out)
npm run build:mobile

# 3. Sync web assets to Android project
npx cap sync android

# 4. Open in Android Studio
npx cap open android
```

Then in Android Studio: click **Run ▶** (green play button) to launch on emulator/device.

### One-Command Build + Sync

```bash
npm run mobile:build
```

This runs `build:mobile` followed by `cap sync android`.

### Live Reload (Development)

For faster iteration during development:

1. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

2. Edit `capacitor.config.ts` and uncomment the dev server URL:
   ```typescript
   server: {
     url: 'http://10.0.2.2:3000', // Android emulator → host
     cleartext: true,
   }
   ```

3. Sync and run:
   ```bash
   npx cap sync android
   npx cap run android
   ```

> **Important**: Remember to comment out the `url` before building for production/testing.

## Google Sign-In Setup (Required for Auth)

### 1. Create Android OAuth Client in Google Cloud Console

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Select the MelodyWings project
3. Click **Create Credentials → OAuth client ID**
4. Choose **Android** application type
5. Set:
   - Package name: `org.melodywings.app`
   - SHA-1 fingerprint (see below)

### 2. Get SHA-1 Fingerprint

For debug builds:
```bash
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

### 3. Download google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Add an Android app with package name `org.melodywings.app`
3. Download `google-services.json`
4. Place it in `android/app/google-services.json`

> **Note**: Push notifications require Firebase. Without `google-services.json`, the app works but push notifications are disabled.

## Push Notifications

Push notifications use Firebase Cloud Messaging (FCM). After adding `google-services.json`:

1. Notifications are auto-registered on app startup
2. FCM token is sent to backend at `/api/v1/notifications/register-device`
3. Backend can send push via Firebase Admin SDK

## Project Structure (Mobile Services)

```
src/
├── services/
│   ├── native-auth.ts         # Native Google Sign-In
│   ├── push-notifications.ts  # FCM + local notifications
│   ├── camera.ts              # Camera/gallery capture
│   ├── network.ts             # Network status monitoring
│   └── app-lifecycle.ts       # Back button, status bar, keyboard
├── utils/
│   └── platform.ts            # Platform detection (web/android/ios)
├── config/
│   └── api.ts                 # Runtime API URL configuration
├── components/
│   ├── guards/RouteGuard.tsx  # Client-side auth guard (mobile)
│   └── common/NetworkStatus.tsx  # Offline banner
└── hooks/
    └── useMobileInit.ts       # Initializes all mobile features
```

## How the Dual Build Works

The web and mobile builds use different configurations:

| Aspect | Web Build | Mobile Build |
|--------|-----------|-------------|
| Config | `next.config.js` + `next.config.mjs` | `next.config.mobile.mjs` |
| Output | `.next/` (SSR) | `out/` (static HTML) |
| Images | Optimized (server) | Unoptimized (client) |
| Middleware | Active (server) | Disabled (client RouteGuard) |
| Deployment | Vercel | Android APK/AAB |

The `scripts/use-mobile-config.js` temporarily:
1. Moves `next.config.js` out of the way
2. Replaces `next.config.mjs` with mobile version
3. Removes `force-dynamic` from layout
4. Disables middleware.ts

After build, `scripts/restore-web-config.js` restores everything.

## Testing Checklist

- [ ] App launches without crash
- [ ] Landing page loads correctly
- [ ] Google Sign-In works (requires OAuth setup)
- [ ] Navigation between pages works
- [ ] Back button works (goes back / exits app)
- [ ] Network offline shows banner
- [ ] Network online hides banner
- [ ] Images load (Cloudinary)
- [ ] Status bar is white with dark text
- [ ] Keyboard doesn't overlap content
- [ ] Profile picture upload works (camera/gallery)
- [ ] Push notification permission prompt shows
- [ ] Session persists after app restart

## Troubleshooting

### "Web assets not found" error
Run `npm run build:mobile` before `npx cap sync android`.

### Google Sign-In fails
Ensure `google-services.json` is in `android/app/` and SHA-1 matches.

### CORS errors on API calls
Ensure the backend has `capacitor://localhost` and `http://localhost` in CORS origins.

### Build fails with "force-dynamic" error
The `use-mobile-config.js` script should handle this. If it persists, manually check that middleware.ts is moved.

## Git Workflow

- Branch: `feature/capacitor-android-app`
- All mobile code is backwards-compatible with web
- Web build (`npm run build`) must always pass
- Mobile build (`npm run build:mobile`) produces static export
- Never commit backup files (*.web-backup)
