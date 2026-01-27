import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCookiesFound, isTokenValid } from "./utils/auth";

const PROTECTED_ROUTES = ["/learner", "/volunteer"];
const LANDING_PAGE_ROUTES = ["/", "/about-us", "/privacy-policy", "/terms-and-conditions"];
const ALWAYS_ACCESSIBLE_ROUTES = ["/privacy-policy", "/terms-and-conditions"];
const EXCLUDED_PATHS = ["/favicon.ico", "/logo.png"];

// List of search engine crawler user agents
const SEARCH_ENGINE_BOTS = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "sogou",
  "exabot",
  "facebot",
  "ia_archiver",
  "facebookexternalhit",
  "twitterbot",
  "rogerbot",
  "linkedinbot",
  "embedly",
  "quora link preview",
  "showyoubot",
  "outbrain",
  "pinterest",
  "developers.google.com/+/web/snippet",
];

// Check if the request is from a search engine crawler
function isSearchEngineBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return SEARCH_ENGINE_BOTS.some((bot) => ua.includes(bot));
}

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const userAgent = req.headers.get("user-agent");

  // Allow search engine bots to access public pages
  const isBot = isSearchEngineBot(userAgent);
  const PUBLIC_ROUTES = ["/", "/about-us", "/privacy-policy", "/terms-and-conditions", "/robots.txt", "/sitemap.xml"];

  if (isBot && PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  if (EXCLUDED_PATHS.includes(pathname) || pathname.startsWith("/_next") || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }

  const { cookies } = req;
  const isUserCookiesFound = isCookiesFound(cookies);
  const isUserTokenValid = isTokenValid(cookies);
  const role = cookies.get("role")?.value;
  const onboardedStatus = cookies.get("onboarded_status")?.value || "";

  if (!isUserCookiesFound || !isUserTokenValid) {
    // Allow bots to access landing pages
    if (isBot && PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }
    if (!LANDING_PAGE_ROUTES.includes(pathname)) return NextResponse.redirect(new URL("/", origin));
    return NextResponse.next();
  }

  if (onboardedStatus !== "verification_completed" && LANDING_PAGE_ROUTES.includes(pathname)) return NextResponse.next();

  if (onboardedStatus === "details_pending" && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  if (onboardedStatus === "partially_filled" && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  if (["verification_pending", "verification_rejected"].includes(onboardedStatus) && pathname !== "/onboarding/verification") {
    return NextResponse.redirect(new URL("/onboarding/verification", origin));
  }

  if (onboardedStatus === "verification_completed") {
    // Allow access to privacy policy and terms and conditions even when logged in
    if (ALWAYS_ACCESSIBLE_ROUTES.includes(pathname)) {
      return NextResponse.next();
    }
    if (LANDING_PAGE_ROUTES.includes(pathname) || !pathname.startsWith(`/${role}`) || PROTECTED_ROUTES.includes(pathname)) {
      // Redirect learners to instant-sessions, volunteers to schedule
      const defaultRoute = role === "learner" ? `/${role}/instant-sessions` : `/${role}/schedule`;
      return NextResponse.redirect(new URL(defaultRoute, origin));
    }
  }

  return NextResponse.next();
}
