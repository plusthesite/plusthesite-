import AnimatedLogo from "@/components/AnimatedLogo";

/**
 * plus. brand logo.
 *
 * Renders the vector wordmark (see AnimatedLogo) instead of the old PNG, so it
 * stays crisp at any size, recolours per theme, and can animate.
 * - variant "dark"  (light backgrounds): blue mark + navy wordmark
 * - variant "light" (dark backgrounds):  solid white
 * - variant "auto":  follows the active theme through CSS, so it stays
 *   hydration-safe (no reading the theme during render)
 */
export default function Logo({
    variant = "dark",
    size = "default",
    href = "/",
    className = "",
}: {
    variant?: "dark" | "light" | "auto";
    size?: "small" | "default" | "large";
    href?: string;
    className?: string;
}) {
    return (
        <AnimatedLogo
            variant={variant}
            size={size}
            href={href}
            className={className}
        />
    );
}
