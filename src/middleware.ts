import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCookiesFound, isTokenValid } from "./utils/auth";

const PROTECTED_ROUTES = ["/learner", "/volunteer"];
const LANDING_PAGE_ROUTES = ["/login", "/about-us", "/privacy-policy", "/terms-and-conditions"];
const EXCLUDED_PATHS = ["/favicon.ico", "/logo.png"];

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  if (EXCLUDED_PATHS.includes(pathname) || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  const { cookies } = req;
  const isUserCookiesFound = isCookiesFound(cookies);
  const isUserTokenValid = isTokenValid(cookies);
  const role = cookies.get("role")?.value;
  const onboardedStatus = cookies.get("onboarded_status")?.value || "";

  if (!isUserCookiesFound || !isUserTokenValid) {
    if (!LANDING_PAGE_ROUTES.includes(pathname)) return NextResponse.redirect(new URL("/login", origin));
    return NextResponse.next();
  }

  if (onboardedStatus !== "verification_completed" && LANDING_PAGE_ROUTES.includes(pathname)) return NextResponse.next();

  if (onboardedStatus === "details_pending" && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", origin));
  }

  if (["verification_pending", "verification_rejected"].includes(onboardedStatus) && pathname !== "/onboarding/verification") {
    return NextResponse.redirect(new URL("/onboarding/verification", origin));
  }

  if (onboardedStatus === "verification_completed") {
    if (LANDING_PAGE_ROUTES.includes(pathname) || !pathname.startsWith(`/${role}`) || PROTECTED_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL(`/${role}/schedule`, origin));
    }
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", origin));
  }

  return NextResponse.next();
}
