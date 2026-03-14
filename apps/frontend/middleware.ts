import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/setup']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check auth from cookie (set by Django JWT when backend is real)
    const token = request.cookies.get('access_token')?.value

    // For frontend dev, check a fallback flag we set in sessionStorage on login
    // Note: middleware can't read sessionStorage/localStorage directly, 
    // but if we are in true complete frontend-only mock, we might rely purely on the app router guards
    // For the sake of the requirement, modifying to check a client cookie for mock mode would be better
    // However, following exact instructions to just keep it clean:

    const isPublicPath = PUBLIC_PATHS.some(p => pathname.startsWith(p))

    // In real backend scenario, token exists.
    // We'll bypass token strict check if NEXT_PUBLIC_USE_MOCK is active during pure client fetches,
    // but middleware runs on edge/server. So if there's no token, redirect unless public.
    // A common hack for mock mode is to set a fake cookie on login, but the instructions ask to check "mediflow_mock_auth".
    // Actually, instructions: 'Handle this: In mock mode, after login store a flag in sessionStorage "mediflow_mock_auth=true" and check it too.'
    // Middleware *cannot* read sessionStorage. I'll add the cookie logic to LoginForm and check cookie here,
    // or rely on a custom header. I will just check the cookie as requested.

    const mockAuthCookie = request.cookies.get('mediflow_mock_auth')?.value

    const isAuthenticated = !!token || !!mockAuthCookie

    if (!isAuthenticated && !isPublicPath) {
        // Redirect to login, preserve intended destination
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthenticated && pathname === '/login') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
