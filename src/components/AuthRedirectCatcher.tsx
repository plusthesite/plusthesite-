"use client";

import { useEffect } from "react";
import { STUDIO_URL } from "@/lib/studio";

/**
 * Safety net for Studio OAuth.
 *
 * When Supabase cannot honour the requested `redirectTo` (e.g. the exact
 * www/non-www URL is not whitelisted) it falls back to the project Site URL. If
 * that is still the marketing site, the user lands on a public page with the
 * auth token dangling in the URL (`/en#access_token=...`). This catches that
 * case and forwards to the studio subdomain with the fragment intact, so the
 * studio's Supabase client can finish the sign-in.
 *
 * Once the Supabase Site URL points at studio.plusthe.site this becomes dead
 * weight and can be deleted.
 */
export default function AuthRedirectCatcher() {
    useEffect(() => {
        if (typeof window === "undefined") return;
        const { hash, search } = window.location;

        const hasToken = hash.includes("access_token=") || hash.includes("error=");
        const hasCode = new URLSearchParams(search).has("code");
        if (!hasToken && !hasCode) return;

        // Preserve the fragment/query so detectSessionInUrl can finish the login.
        window.location.replace(`${STUDIO_URL}/${search}${hash}`);
    }, []);

    return null;
}
