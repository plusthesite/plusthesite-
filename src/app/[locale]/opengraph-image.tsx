import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, defaultLocale } from "@/i18n/config";
import { LOGO_VIEW_BOX, MARK_VIEW_BOX, MARK_D, GLYPHS } from "@/lib/logoPaths";
import { loadOgFonts } from "@/lib/ogFonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "plus. - Global Digital AI-gency";

// Same palette the light hero paints with, so a shared link and the page it
// opens read as one design.
const INK = "#020617";
const MUTED = "#475569";
const BLUE = "#0C74EB";

export default async function Image({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const dict = getDictionary(isLocale(locale) ? locale : defaultLocale);
    const fonts = await loadOgFonts();

    // Indonesian runs longer than English; step down rather than wrap to three lines.
    const longestLine = Math.max(
        dict.hero.titleLine1.length,
        dict.hero.titleLine2.length
    );
    const headlineSize = longestLine > 22 ? 56 : 68;

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
                {/* The hero's three colour fields, same values, scaled to the card. */}
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

                {/* The brand mark, solid and bled off the right edge exactly as on the page. */}
                <div
                    style={{
                        position: "absolute",
                        display: "flex",
                        top: 52,
                        right: -66,
                        width: 420,
                        height: 420,
                    }}
                >
                    <svg width="420" height="420" viewBox={MARK_VIEW_BOX}>
                        <path d={MARK_D} fill={BLUE} />
                    </svg>
                </div>

                {/* Content sits on the baseline, the way the hero stacks it. */}
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
                            {dict.hero.badge}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
                        <div
                            style={{
                                display: "flex",
                                fontSize: headlineSize,
                                fontWeight: 500,
                                lineHeight: 1.08,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            {dict.hero.titleLine1}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: headlineSize,
                                fontWeight: 500,
                                lineHeight: 1.08,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            {dict.hero.titleLine2}
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            marginTop: 24,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                fontSize: 26,
                                fontWeight: 400,
                                lineHeight: 1.5,
                                color: MUTED,
                                maxWidth: 720,
                            }}
                        >
                            {dict.meta.ogDescription}
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
