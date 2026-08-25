"use client";

import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from "shaders/react";

const BRAND = "#0c74eb";

/**
 * WebGPU shader stack for the hero: swirling base, brand-coloured chroma flow,
 * fluted glass refraction, and a light film grain on top.
 *
 * Loaded only through HeroBackdrop (dynamic, client-only) and only when
 * NEXT_PUBLIC_HERO_SHADER is enabled — the `shaders` package needs a
 * commercial licence and a WebGPU-capable browser.
 */
export default function HeroShaderStack({
    dark,
    onUnavailable,
}: {
    dark: boolean;
    onUnavailable: () => void;
}) {
    return (
        <Shader
            disableTelemetry
            onUnavailable={onUnavailable}
            style={{ width: "100%", height: "100%" }}
        >
            <Swirl
                colorA={dark ? "#0b1120" : "#ffffff"}
                colorB={dark ? "#131f38" : "#f0f0f0"}
                detail={1.7}
            />
            <ChromaFlow
                baseColor={dark ? "#0b1120" : "#ffffff"}
                downColor={BRAND}
                leftColor={BRAND}
                rightColor={BRAND}
                upColor={BRAND}
                momentum={13}
                radius={3.5}
            />
            <FlutedGlass
                aberration={0.61}
                angle={31}
                frequency={8}
                highlight={0.12}
                highlightSoftness={0}
                lightAngle={-90}
                refraction={4}
                shape="rounded"
                softness={1}
                speed={0.15}
            />
            <FilmGrain strength={0.05} />
        </Shader>
    );
}
