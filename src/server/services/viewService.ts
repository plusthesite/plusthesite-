import { incrementArticleView } from "@/server/repositories/viewRepo";
import type { ViewInput } from "@/server/validators/view";

/** Record an article view. Always resolves (never errors) so the UI's view
 * counter degrades to null instead of failing. */
export async function recordView(input: ViewInput): Promise<{ views: number | null }> {
    const views = await incrementArticleView(input.slug);
    return { views };
}
