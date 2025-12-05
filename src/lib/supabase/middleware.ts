import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // fallback to placeholder if env vars are missing to prevent crash during build/dev if not set
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes pattern
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const adminSession = request.cookies.get('admin_session')
        if (!user && !adminSession) {
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    if (request.nextUrl.pathname.startsWith('/profile')) {
        const employeeSession = request.cookies.get('employee_session')
        if (!user && !employeeSession) {
            // For profile, we might still want to check user session, but for now let's keep it simple
            // If using custom auth, we might need a similar cookie for users
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }
    }

    return response
}
