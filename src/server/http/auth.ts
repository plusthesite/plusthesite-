import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ServiceError } from "@/server/http/errors";

/**
 * Require a logged-in admin session (cookie-bound). Returns the user, or
 * throws a 401 ServiceError. The session lives in request cookies, so this is
 * an HTTP-boundary concern and stays out of the service layer.
 */
export async function requireAdmin(): Promise<User> {
    const supabase = await createSupabaseServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new ServiceError(401, { error: "unauthorized" });
    return user;
}
