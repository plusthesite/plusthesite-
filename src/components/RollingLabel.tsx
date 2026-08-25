/**
 * Button label that rolls up to its duplicate on hover.
 * Requires the nearest interactive ancestor to carry the `group` class.
 * Motion is defined in globals.css (`.text-roll`).
 */
export default function RollingLabel({ children }: { children: string }) {
    return (
        <span className="text-roll">
            <span className="text-roll__inner">
                <span className="text-roll__line">{children}</span>
                <span className="text-roll__line" aria-hidden>
                    {children}
                </span>
            </span>
        </span>
    );
}
