"use client";

import { useEffect } from "react";

/**
 * Safety net for Studio OAuth.
 *
 * When Supabase can't honour the requested `redirectTo` (e.g. the exact
 * www/non-www URL isn't whitelisted) it falls back to the Site URL — landing
 * the user on a public page with the auth token left dangling in the URL
 * (`/en#access_token=...`). This catches that case: if we see an auth token in
 * the URL and we're NOT already inside the studio, we forward to
 * `/{locale}/studio` preserving the hash so the studio's Supabase client
 * consumes the session and signs the user in.
 */
export default function AuthRedirectCatcher() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        const { hash, search, pathname } = window.location;

        // Already in the studio — its own client handles the session.
        if (pathname.includes("/studio")) return;

        const hasToken = hash.includes("access_token=") || hash.includes("error=");
        const hasCode = new URLSearchParams(search).has("code");
        if (!hasToken && !hasCode) return;

        const seg = pathname.split("/").filter(Boolean)[0];
        const locale = seg === "id" ? "id" : "en";
        // Preserve the fragment/query so detectSessionInUrl can finish the login.
        window.location.replace(`/${locale}/studio${search}${hash}`);
    }, []);

    return null;
}
