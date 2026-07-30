import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { locales, defaultLocale } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

/** Refresh the Supabase auth session cookie (admin area). */
async function updateSession(request: NextRequest) {
    let response = NextResponse.next({ request });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return response;

    const supabase = createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                response = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    response.cookies.set(name, value, options)
                );
            },
        },
    });
    await supabase.auth.getUser();
    return response;
}

function getPreferredLocale(request: NextRequest): string {
    const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (cookieLocale && (locales as readonly string[]).includes(cookieLocale)) {
        return cookieLocale;
    }

    const accept = request.headers.get("accept-language");
    if (accept) {
        const preferred = accept
            .split(",")
            .map((part) => part.split(";")[0].trim().toLowerCase());
        for (const lang of preferred) {
            const base = lang.split("-")[0];
            if ((locales as readonly string[]).includes(base)) {
                return base;
            }
        }
    }

    return defaultLocale;
}

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const host = request.headers.get("host")?.toLowerCase() ?? "";
    const isHackathonHost = host.startsWith("hackathon.");
    if (isHackathonHost) {
        if (
            pathname.startsWith("/_next") ||
            pathname.startsWith("/api") ||
            PUBLIC_FILE.test(pathname)
        ) {
            return NextResponse.next();
        }

        if (pathname === "/hackathon" || pathname.startsWith("/hackathon/")) {
            return NextResponse.next();
        }

        const url = request.nextUrl.clone();
        url.pathname = `/hackathon${pathname === "/" ? "" : pathname}`;
        return NextResponse.rewrite(url);
    }

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname === "/sitemap.xml" ||
        pathname === "/robots.txt" ||
        pathname === "/llms.txt" ||
        pathname === "/favicon.ico" ||
        pathname === "/favicon.png" ||
        PUBLIC_FILE.test(pathname)
    ) {
        return NextResponse.next();
    }

    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
        return await updateSession(request);
    }

    if (pathname === "/hackathon" || pathname.startsWith("/hackathon/")) {
        return NextResponse.next();
    }

    const hasLocale = locales.some(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );
    if (hasLocale) {
        return NextResponse.next();
    }

    const locale = getPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: [
        "/((?!_next|api|.*\\..*).*)",
    ],
};
