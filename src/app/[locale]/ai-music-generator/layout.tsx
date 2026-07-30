import type { Metadata } from "next";
import { productMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: Readonly<{ params: Promise<{ locale: string }> }>): Promise<Metadata> {
    const { locale } = await params;

    return productMetadata({
        locale,
        path: "/ai-music-generator",
        title: "AI Music Generator - Sound Directions, Variations & Audio Workflow | plus.",
        description:
            "AI music generation support for content audio, sound direction, prototype tracks, and faster repeatable audio production.",
    });
}

export default function AiMusicGeneratorLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return <>{children}</>;
}
