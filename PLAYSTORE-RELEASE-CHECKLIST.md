# MelodyWings Play Store Release Checklist

**Branch**: `release/playstore-v1.0.0`  
**Version**: 1.0.0 (versionCode: 1)  
**Date**: June 24, 2026

---

## ✅ Completed (Code Changes)

- [x] API URL switched to production (`https://api.melodywings.org/api/v1`)
- [x] Cleartext traffic disabled (capacitor.config.ts + AndroidManifest)
- [x] Network security config added (only allows cleartext for local dev)
- [x] Release signing config added to build.gradle
- [x] ProGuard enabled with minifyEnabled + shrinkResources
- [x] ProGuard rules written for Capacitor/Firebase/WebView
- [x] Version bumped to 1.0.0 (package.json + build.gradle)
- [x] Keystores directory with setup instructions created
- [x] Account deletion feature added (Play Store requirement)
- [x] Backend DELETE endpoint for account deletion added
- [x] Custom app icons already in place (webp format, all densities)
- [x] Build passes type checking successfully

---

## 🔴 Manual Steps Required (Before Building AAB)

### 1. Generate Release Keystore
```bash
cd melody-wings-frontend
keytool -genkey -v -keystore keystores/melodywings-release.keystore -alias melodywings -keyalg RSA -keysize 2048 -validity 10000
```
⚠️ **BACK UP the keystore immediately. If lost, you cannot update the app.**

### 2. Get Release SHA-1 & Configure Firebase
```bash
keytool -list -v -keystore keystores/melodywings-release.keystore -alias melodywings
```
Then:
1. Go to Firebase Console → Project Settings → Android app
2. Add the **release SHA-1** fingerprint
3. Go to Google Cloud Console → Credentials → Create Android OAuth client
   - Package: `org.melodywings.app`
   - SHA-1: (from above)
4. Re-download `google-services.json` → place in `android/app/`

### 3. Set Environment Variables (for signing)
```bash
set KEYSTORE_PASSWORD=your_password
set KEY_PASSWORD=your_key_password
```

### 4. Build Production AAB
```bash
npm run build:mobile
npx cap sync android
cd android
gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🟡 Google Play Console Setup

### Store Listing
- [ ] App name: **MelodyWings**
- [ ] Short description (80 chars): "Connect learners with volunteer music teachers for free online lessons"
- [ ] Full description (4000 chars): Write detailed feature description
- [ ] App icon: 512x512 PNG (high-res version of existing icon)
- [ ] Feature graphic: 1024x500 PNG (promotional banner)
- [ ] Screenshots: Min 2, recommended 5-8 (phone: 1080x1920)
- [ ] Category: **Education**
- [ ] Contact email: (required)
- [ ] Privacy policy URL: `https://melodywings.org/privacy-policy`

### Content Rating
- [ ] Fill IARC questionnaire
  - App type: Education
  - No violence / No mature content
  - Target audience: 13+ (avoids stricter COPPA rules)

### Data Safety Form
- [ ] Personal info collected: Name, email (Google Sign-In)
- [ ] Photos collected: Profile pictures (Cloudinary)
- [ ] Device identifiers: FCM push token
- [ ] App activity: Analytics (PostHog)
- [ ] Data encrypted in transit: Yes (HTTPS)
- [ ] Data deletion available: Yes (Settings → Delete Account)
- [ ] Third parties: Google (auth), Cloudinary (images), PostHog (analytics)

---

## 🟡 Testing Before Submission

### Physical Device Testing
- [ ] Budget phone (Android 7-8)
- [ ] Mid-range phone (Android 11-12)
- [ ] Flagship phone (Android 13-14)

### Test Scenarios
- [ ] Fresh install → Google Sign-In → Onboarding flow
- [ ] Session persists after kill/reopen
- [ ] Airplane mode → offline banner → recovery
- [ ] Profile photo upload (camera + gallery)
- [ ] Push notification receive + tap
- [ ] Back button navigation + app exit
- [ ] Delete Account flow (Settings → Delete → Confirm)
- [ ] Google Sign-In with RELEASE build (production OAuth)

---

## Timeline

| Task | Est. Duration |
|------|---------------|
| Generate keystore + Firebase OAuth | 1 day |
| Build signed AAB + device testing | 2-3 days |
| Store listing (screenshots, copy) | 1 day |
| Submit to Play Console | 1 day |
| Google review period | 3-7 days |
| **Total** | **~7-12 days** |

---

## Branch Structure

```
melody-wings-frontend:
  master (web production)
  └── feature/capacitor-android-app (mobile base)
      └── fix/mobile-auth-redirect (auth fixes)
          └── release/playstore-v1.0.0 ← YOU ARE HERE

melody-wings-backend:
  master (API production)
  └── feature/mobile-cors-support (CORS for mobile)
      └── release/playstore-v1.0.0 ← account deletion endpoint
```

---

## Post-Submission Notes

- First review can take 3-7 days (up to 14 for new accounts)
- Common rejection reasons: broken OAuth, missing data safety, no account deletion
- After approval, merge `release/playstore-v1.0.0` back into `feature/capacitor-android-app` and then into `master`
