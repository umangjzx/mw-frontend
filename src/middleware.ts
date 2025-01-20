import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCookiesFound, isTokenValid } from "./utils/auth";

const PROTECTED_ROUTES = ["/learner", "/volunteer"];
const ONBOARDING_ROUTES = ["/onboarding", "/onboarding/verification"];
const LANDING_PAGE_ROUTES = ["/login", "/about-us", "/privacy-policy", "/terms-and-conditions"];

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  if (pathname === "/favicon.ico" || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const { cookies } = req;
  const isUserCookiesFound = isCookiesFound(cookies);

  if ((!isUserCookiesFound || !isTokenValid(cookies)) && !LANDING_PAGE_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (isUserCookiesFound) {
    const isUserTokenValid = isTokenValid(cookies);
    const role = cookies.get("role")?.value;
    const onboardedStatus = cookies.get("onboarded_status")?.value;

    if (isUserTokenValid) {
      if (onboardedStatus === "details_pending" && pathname !== '/onboarding') {
        return NextResponse.redirect(new URL("/onboarding", origin));
      }
      if (onboardedStatus === "verification_pending" && pathname !== '/onboarding/verification') {
        return NextResponse.redirect(new URL("/onboarding/verification", origin));
      }
      if (onboardedStatus === "verification_completed" && !pathname.startsWith(`/${role}`) || PROTECTED_ROUTES.includes(pathname)) {
        return NextResponse.redirect(new URL(`/${role}/schedule`, origin));
      }
    }

    if (!isUserTokenValid && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", origin));
    }
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.next();
}
