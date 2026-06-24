# Add project specific ProGuard rules here.
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Preserve line numbers for debugging crash reports
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ============================================================
# Capacitor Core
# ============================================================
-keep class com.getcapacitor.** { *; }
-keep class org.melodywings.app.** { *; }

# Capacitor plugins
-keep class com.capacitorjs.plugins.** { *; }

# Social login plugin (Google Sign-In)
-keep class ee.forgr.capacitor.social.login.** { *; }

# ============================================================
# Firebase & Google Play Services
# ============================================================
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# ============================================================
# WebView / JavaScript Interface
# ============================================================
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
    public void *(android.webkit.WebView, java.lang.String);
}

# Keep WebView
-keep class android.webkit.** { *; }

# ============================================================
# AndroidX
# ============================================================
-keep class androidx.** { *; }
-dontwarn androidx.**

# ============================================================
# OkHttp (used by Capacitor HTTP)
# ============================================================
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }

# ============================================================
# Kotlin (if used by any plugin)
# ============================================================
-dontwarn kotlin.**
-keep class kotlin.** { *; }
