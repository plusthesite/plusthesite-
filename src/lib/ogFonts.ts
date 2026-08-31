/**
 * Fonts for the generated link-preview cards.
 *
 * Satori (the renderer behind next/og) only ships Noto Sans *Regular*. Any
 * `fontWeight` above 400 therefore falls back to the regular cut instead of
 * being synthesised - which is why the old card rendered a "bold" headline
 * that looked like body text. Supplying real weights is what makes the card
 * read as designed.
 *
 * Google serves a Satori-parseable TTF (rather than WOFF2, which it cannot
 * read) when the request looks like an ancient Android browser.
 *
 * Best-effort by design: a build with no network access falls back to the
 * built-in font instead of failing.
 */

export type OgFont = {
    name: string;
    data: ArrayBuffer;
    weight: 400 | 500 | 700;
    style: "normal";
};

const FAMILY = "Geist";
const WEIGHTS = [400, 500, 700] as const;
const TTF_UA =
    "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1";

let cache: Promise<OgFont[]> | null = null;

async function loadFace(weight: (typeof WEIGHTS)[number]): Promise<OgFont> {
    const css = await fetch(
        `https://fonts.googleapis.com/css2?family=${FAMILY}:wght@${weight}`,
        { headers: { "User-Agent": TTF_UA } }
    ).then((res) => res.text());

    const url = css.match(/url\((https:[^)]+)\)/)?.[1];
    if (!url) throw new Error(`No TTF returned for ${FAMILY} ${weight}`);

    return {
        name: FAMILY,
        data: await fetch(url).then((res) => res.arrayBuffer()),
        weight,
        style: "normal",
    };
}

export function loadOgFonts(): Promise<OgFont[]> {
    cache ??= Promise.all(WEIGHTS.map(loadFace)).catch((error) => {
        console.warn("[og] using the built-in font:", error);
        cache = null; // let the next render try again
        return [];
    });
    return cache;
}
