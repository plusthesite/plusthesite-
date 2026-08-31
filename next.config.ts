import type { NextConfig } from "next";

/**
 * Headers every HTML/route response carries. Static assets get their own
 * long-lived cache rule below; these are the safety ones.
 */
const SECURITY_HEADERS = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
    // HSTS is safe once the VPS terminates TLS for the apex + www. Nginx can
    // set it too; keeping it here means it survives a proxy misconfiguration.
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const IMMUTABLE = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];

const nextConfig: NextConfig = {
    // Emit .next/standalone: a self-contained server bundle with only the
    // node_modules it actually imports. This is what gets rsynced to the VPS -
    // it boots with `node server.js` and skips installing dev/build deps there.
    output: "standalone",

    // Don't advertise the framework, and gzip at the app layer as a fallback
    // for when nginx compression is off.
    poweredByHeader: false,
    compress: true,

    turbopack: {
        root: __dirname,
    },

    async headers() {
        return [
            // Static files in /public never change between deploys without a new
            // name, so let every browser and the CDN keep them for good.
            { source: "/:asset.(png|jpg|jpeg|svg|webp|avif|ico|woff2)", headers: IMMUTABLE },
            { source: "/textures/:asset.(svg|png|webp)", headers: IMMUTABLE },
            // API responses are per-request; never let a proxy cache them.
            {
                source: "/api/:path*",
                headers: [
                    ...SECURITY_HEADERS,
                    { key: "Cache-Control", value: "no-store, max-age=0" },
                ],
            },
            { source: "/:path*", headers: SECURITY_HEADERS },
        ];
    },

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "images.unsplash.com" },
            { protocol: "https", hostname: "*.supabase.co" },
            { protocol: "https", hostname: "lh3.googleusercontent.com" },
            { protocol: "https", hostname: "avatars.githubusercontent.com" },
        ],
    },
};

export default nextConfig;
