# MelodyWings Release Keystore

## Generate the release keystore (ONE TIME ONLY)

```bash
keytool -genkey -v -keystore melodywings-release.keystore -alias melodywings -keyalg RSA -keysize 2048 -validity 10000
```

When prompted:
- **Keystore password**: Choose a strong password
- **Key alias**: melodywings
- **Key password**: Choose a strong password
- **First and Last Name**: MelodyWings
- **Organization**: MelodyWings Foundation
- **Country Code**: IN

## CRITICAL

- **NEVER commit the .keystore file to git**
- **Store a backup** in a secure location (Google Drive, encrypted USB, etc.)
- If this keystore is **lost**, you can NEVER update the app on Play Store again
- Store passwords in a password manager

## Get SHA-1 fingerprint (for Firebase/OAuth)

```bash
keytool -list -v -keystore melodywings-release.keystore -alias melodywings
```

## Environment variables for CI/CD

Set these before building:
```
KEYSTORE_PASSWORD=your_keystore_password
KEY_PASSWORD=your_key_password
```
