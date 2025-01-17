import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isCookiesFound, isTokenValid } from "./utils/auth";

const PROTECTED_ROUTES = ["/learner", "/volunteer"];
const ONBOARDING_ROUTES = ["/onboarding", "/onboarding/verification"];
const LANDING_PAGE_ROUTES = ["/login", "/about-us", "/policy", "/terms"];

export default function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;
    const { cookies } = req;
    const isUserCookiesFound = isCookiesFound(cookies);

    if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
        return NextResponse.next();
    }

    if (
        (!isUserCookiesFound || !isTokenValid(cookies)) &&
        !LANDING_PAGE_ROUTES.includes(pathname)
    ) {
        return NextResponse.redirect(new URL("/login", origin));
    }

    if (isUserCookiesFound) {
        const isUserTokenValid = isTokenValid(cookies);
        const role = cookies.get("role")?.value;
        const onboardedStatus = cookies.get("onboarded_status")?.value;

        if (isUserTokenValid) {
            if (onboardedStatus === "details_pending" && !ONBOARDING_ROUTES.includes(pathname)) {
                return NextResponse.redirect(new URL("/onboarding", origin));
            }
            if (
                (onboardedStatus === "verification_completed" &&
                    !pathname.startsWith(`/${role}`)) ||
                PROTECTED_ROUTES.includes(pathname)
            ) {
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
