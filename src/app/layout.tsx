import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Poppins } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";

import RootLayoutClient from "./RootLayoutClient";
import PostHogProvider from "@/providers/PostHog";
import { GOOGLE_ANALYTICS_ID, GOOGLE_WEB_CLIENT_ID } from "@/definitions";

const poppins = Poppins({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "MelodyWings - limitless free learning",
        template: "%s | MelodyWings",
    },
    description: "MelodyWings is a heartfelt initiative created to provide free tutoring for students with disabilities and special needs by volunteers",
    keywords: ["learning", "education", "volunteer teaching", "online learning", "community", "skills", "tutoring"],
    authors: [{ name: "MelodyWings" }],
    creator: "MelodyWings",
    publisher: "MelodyWings",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: [
            { url: "/favicon.ico", sizes: "any" },
            { url: "/logo.png", type: "image/png", sizes: "32x32" },
        ],
        shortcut: "/favicon.ico",
        apple: "/logo.png",
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://melodywings.org",
        siteName: "MelodyWings",
        title: "MelodyWings - limitless free learning",
        description: "MelodyWings is a heartfelt initiative created to provide free tutoring for students with disabilities and special needs by volunteers",
        images: ["/logo.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "MelodyWings - limitless free learning",
        description: "MelodyWings is a heartfelt initiative created to provide free tutoring for students with disabilities and special needs by volunteers",
        images: ["/logo.png"],
    },
    metadataBase: new URL("https://melodywings.org"),
    alternates: {
        canonical: "/",
    },
};

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
                    strategy="afterInteractive"
                />
                <Script
                    id="gtag-init"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                            gtag('config', '${GOOGLE_ANALYTICS_ID}');
                        `,
                    }}
                />
            </head>
            <body className={poppins.className}>
                <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID || ""}>
                    <PostHogProvider>
                        <RootLayoutClient>{children}</RootLayoutClient>
                    </PostHogProvider>
                </GoogleOAuthProvider>
            </body>
        </html>
    );
}
