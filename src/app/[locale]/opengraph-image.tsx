import { ImageResponse } from "next/og";
import { getDictionary } from "@/i18n/getDictionary";
import { isLocale, defaultLocale } from "@/i18n/config";
import { LOGO_VIEW_BOX, MARK_VIEW_BOX, MARK_D, GLYPHS } from "@/lib/logoPaths";
import { loadOgFonts } from "@/lib/ogFonts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "plus. - Global Digital AI-gency";

const INK = "#F8FAFC";
const BLUE = "#4F6EF7";
const VIOLET = "#7C5CFC";
const ACCENT = "#8AB4FF";

export default async function Image({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const dict = getDictionary(isLocale(locale) ? locale : defaultLocale);
    const fonts = await loadOgFonts();

    // The same three proof points the About section shows on the page, so the
    // preview promises exactly what the visitor lands on.
    const stats = [
        { value: "AI+", label: dict.about.statPoweredLabel },
        { value: "6+", label: dict.about.statProductsLabel },
        { value: "5+", label: dict.about.statToolsLabel },
    ];

    // Indonesian runs longer than English, and a headline that wraps to three
    // lines eats the breathing room the card needs. Step the size down instead.
    const longestLine = Math.max(
        dict.hero.titleLine1.length,
        dict.hero.titleLine2.length
    );
    const headlineSize = longestLine > 22 ? 58 : 70;

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
                {/* Brand glow, warm blue over deep space - the same lighting as the hero. */}
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
                            "radial-gradient(circle, rgba(79,110,247,0.45) 0%, rgba(79,110,247,0) 70%)",
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
                            "radial-gradient(circle, rgba(124,92,252,0.40) 0%, rgba(124,92,252,0) 70%)",
                    }}
                />

                {/* Oversized brand mark, bled off the right edge so the card is
                    recognisable as plus. even in a thumbnail crop. */}
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
                        <path d={MARK_D} fill="rgba(122,150,255,0.13)" />
                    </svg>
                </div>

                {/* Top edge accent - a small signal of a designed page. */}
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
                    {/* Logo lockup + positioning badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <svg width="214" height="94" viewBox={LOGO_VIEW_BOX}>
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
                                letterSpacing: "0.14em",
                                textTransform: "uppercase",
                            }}
                        >
                            {dict.hero.badge}
                        </div>
                    </div>

                    {/* Headline - the promise, in two lines, with the payoff in brand blue. */}
                    <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
                        <div
                            style={{
                                display: "flex",
                                fontSize: headlineSize,
                                fontWeight: 900,
                                lineHeight: 1.04,
                                letterSpacing: "-0.035em",
                            }}
                        >
                            {dict.hero.titleLine1}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                fontSize: headlineSize,
                                fontWeight: 900,
                                lineHeight: 1.04,
                                letterSpacing: "-0.035em",
                                color: ACCENT,
                            }}
                        >
                            {dict.hero.titleLine2}
                        </div>
                        <div
                            style={{
                                display: "flex",
                                marginTop: 22,
                                fontSize: 30,
                                fontWeight: 400,
                                color: "#9FB0CC",
                            }}
                        >
                            {dict.hero.subtitle}
                        </div>
                    </div>

                    {/* Proof row + domain */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 10,
                                        padding: "13px 22px",
                                        borderRadius: 14,
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        background: "rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            fontSize: 26,
                                            fontWeight: 900,
                                            color: ACCENT,
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            fontSize: 22,
                                            fontWeight: 400,
                                            color: "#CBD5E1",
                                        }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
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
