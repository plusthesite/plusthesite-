import { ImageResponse } from "next/og";
import { articles } from "@/data/articles";
import { LOGO_VIEW_BOX, MARK_VIEW_BOX, MARK_D, GLYPHS } from "@/lib/logoPaths";
import { loadOgFonts } from "@/lib/ogFonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "plus. Blog";
export const dynamicParams = false;

const INK = "#020617";
const MUTED = "#475569";
const BLUE = "#0C74EB";

export function generateStaticParams() {
    return articles.map((article) => ({ locale: article.locale ?? "id", slug: article.slug }));
}

export default async function Image({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { slug } = await params;
    const article = articles.find((a) => a.slug === slug);
    const title = article?.title ?? "plus. Blog";
    const category = article?.category ?? "Blog";
    const fonts = await loadOgFonts();

    return new ImageResponse(
        (
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    background: "#FFFFFF",
                    color: INK,
                    fontFamily: "Geist, sans-serif",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        left: -130,
                        top: -150,
                        width: 640,
                        height: 640,
                        borderRadius: 999,
                        background:
                            "radial-gradient(circle, rgba(12,116,235,0.42) 0%, rgba(12,116,235,0) 68%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        right: -70,
                        top: 20,
                        width: 540,
                        height: 540,
                        borderRadius: 999,
                        background:
                            "radial-gradient(circle, rgba(56,189,248,0.34) 0%, rgba(56,189,248,0) 68%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        left: 300,
                        bottom: -200,
                        width: 580,
                        height: 580,
                        borderRadius: 999,
                        background:
                            "radial-gradient(circle, rgba(124,58,237,0.24) 0%, rgba(124,58,237,0) 68%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        top: 62,
                        right: -40,
                        width: 380,
                        height: 380,
                    }}
                >
                    <svg width="380" height="380" viewBox={MARK_VIEW_BOX}>
                        <path d={MARK_D} fill={BLUE} />
                    </svg>
                </div>

                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        width: "100%",
                        height: "100%",
                        padding: "0 72px 62px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 20,
                            marginBottom: 26,
                        }}
                    >
                        <svg width="150" height="66" viewBox={LOGO_VIEW_BOX}>
                            <path d={MARK_D} fill={BLUE} />
                            {GLYPHS.map((glyph) => (
                                <path key={glyph.name} d={glyph.d} fill={INK} />
                            ))}
                        </svg>
                        <div
                            style={{
                                display: "flex",
                                width: 1,
                                height: 26,
                                background: "rgba(15,23,42,0.22)",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                fontSize: 24,
                                fontWeight: 400,
                                color: "#0F172A",
                            }}
                        >
                            {category}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontSize: title.length > 70 ? 52 : 62,
                            fontWeight: 500,
                            lineHeight: 1.1,
                            letterSpacing: "-0.03em",
                            maxWidth: 760,
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: 28,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: 24,
                                fontWeight: 400,
                                color: MUTED,
                            }}
                        >
                            Global Digital AI-gency
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: 24,
                                fontWeight: 500,
                                color: "#64748B",
                            }}
                        >
                            plusthe.site
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size, fonts }
    );
}
