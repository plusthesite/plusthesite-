import { ImageResponse } from "next/og";
import { articles } from "@/data/articles";
import { LOGO_VIEW_BOX, MARK_VIEW_BOX, MARK_D, GLYPHS } from "@/lib/logoPaths";
import { loadOgFonts } from "@/lib/ogFonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "plus. Blog";
export const dynamicParams = false;

const INK = "#F8FAFC";
const BLUE = "#4F6EF7";
const VIOLET = "#7C5CFC";

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
                    background:
                        "linear-gradient(120deg, #060A16 0%, #0E1730 46%, #1A1042 100%)",
                    color: INK,
                    fontFamily: "Geist, sans-serif",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        top: -200,
                        right: -160,
                        width: 720,
                        height: 720,
                        borderRadius: 999,
                        background:
                            "radial-gradient(circle, rgba(79,110,247,0.42) 0%, rgba(79,110,247,0) 70%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        bottom: -240,
                        left: -180,
                        width: 660,
                        height: 660,
                        borderRadius: 999,
                        background:
                            "radial-gradient(circle, rgba(124,92,252,0.36) 0%, rgba(124,92,252,0) 70%)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        top: 34,
                        right: -96,
                        width: 430,
                        height: 430,
                    }}
                >
                    <svg width="430" height="430" viewBox={MARK_VIEW_BOX}>
                        <path d={MARK_D} fill="rgba(122,150,255,0.12)" />
                    </svg>
                </div>
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        top: 0,
                        left: 0,
                        width: 1200,
                        height: 8,
                        background: `linear-gradient(90deg, ${BLUE} 0%, ${VIOLET} 55%, #22D3EE 100%)`,
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%",
                        height: "100%",
                        padding: "64px 72px 60px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <svg width="196" height="86" viewBox={LOGO_VIEW_BOX}>
                            <path d={MARK_D} fill={BLUE} />
                            {GLYPHS.map((glyph) => (
                                <path key={glyph.name} d={glyph.d} fill={INK} />
                            ))}
                        </svg>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "13px 26px",
                                borderRadius: 999,
                                border: "1px solid rgba(148,163,255,0.38)",
                                background: "rgba(79,110,247,0.16)",
                                color: "#C7D2FE",
                                fontSize: 23,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                            }}
                        >
                            {category}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            fontSize: title.length > 70 ? 56 : 66,
                            fontWeight: 900,
                            lineHeight: 1.08,
                            letterSpacing: "-0.03em",
                            maxWidth: 940,
                        }}
                    >
                        {title}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                fontSize: 26,
                                fontWeight: 400,
                                color: "#9FB0CC",
                            }}
                        >
                            Global Digital AI-gency
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 16,
                                fontSize: 28,
                                fontWeight: 700,
                                color: "#E2E8F0",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    width: 52,
                                    height: 8,
                                    borderRadius: 999,
                                    background: `linear-gradient(90deg, ${BLUE}, ${VIOLET})`,
                                }}
                            />
                            plusthe.site
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size, fonts }
    );
}
