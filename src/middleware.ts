import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticated } from "./utils/auth";

const protectedRoutes = ["/learner", "/volunteer"];

export default function middleware(req: NextRequest) {
    if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    if(req.nextUrl.pathname === "/") {
        const absoluteURL = new URL("/login", req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }

    if (isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname) && req.nextUrl.pathname !== "/") {
        const path = req.nextUrl.pathname.replace("/", "");
        const absoluteURL = new URL(`/${path}/schedule`, req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}
