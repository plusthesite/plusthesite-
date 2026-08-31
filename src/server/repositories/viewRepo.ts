import { tryAdminClient } from "@/server/repositories/client";

/**
 * Increment an article's view counter via the `increment_article_view` RPC and
 * return the new total. Degrades silently to null when Supabase is not
 * configured or the RPC errors - view counts must never break page rendering.
 */
export async function incrementArticleView(slug: string): Promise<number | null> {
    const supabase = tryAdminClient();
    if (!supabase) return null;

    const { data, error } = await supabase.rpc("increment_article_view", { p_slug: slug });
    if (error) return null;
    return data as number;
}
