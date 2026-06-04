import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"]
const onboardingRoute = "/onboarding"

export async function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value
    const { pathname } = request.nextUrl

    if (pathname === "/") {
        return NextResponse.next()
    }

    if (publicRoutes.some(route => pathname.startsWith(route))) {
        if (token) {
            return NextResponse.redirect(new URL("/discover", request.url))
        }
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    const me = await fetch(`http://localhost:8080/api/me`, {
        method: 'GET',
        headers: { Cookie: `access_token=${token}` }
    }).then(r => r.json());

    // Profile is not complete and user is not on some other route -> redirect to /onboarding
    if (!me.profileComplete && pathname !== onboardingRoute) {
        return NextResponse.redirect(new URL(onboardingRoute, request.url))
    }

    // Profile is complete and user is on /onboarding -> redirect to /discover
    if (me.profileComplete && pathname === onboardingRoute) {
        return NextResponse.redirect(new URL("/discover", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}