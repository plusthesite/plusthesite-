import { NextResponse } from "next/server";
import { ServiceError } from "@/server/http/errors";

/**
 * HTTP boundary helpers shared by every route handler.
 *
 * The layering rule: route handlers deal with HTTP (parsing, status codes,
 * headers, rate limiting); services deal with business logic and throw a
 * {@link ServiceError} to short-circuit with a specific response. This module
 * is the only place that knows about both worlds.
 */

// Re-exported so routes can keep importing it from "@/server/http/respond".
export { ServiceError } from "@/server/http/errors";

/** Best-effort client IP from the standard forwarding headers. */
export function getClientIp(req: Request): string {
    return (
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        req.headers.get("x-real-ip") ||
        "unknown"
    );
}

/**
 * Parse a JSON request body, throwing a ServiceError with the given payload
 * when the body is not valid JSON. Routes that want a different failure mode
 * (e.g. fall through to a generic 500) should call `req.json()` directly.
 */
export async function readJson<T = unknown>(
    req: Request,
    onInvalid: { status: number; payload: unknown } = {
        status: 400,
        payload: { error: "invalid_body" },
    }
): Promise<T> {
    try {
        return (await req.json()) as T;
    } catch {
        throw new ServiceError(onInvalid.status, onInvalid.payload);
    }
}

/** Turn a thrown error into a NextResponse. Known ServiceErrors keep their
 * contract; anything else becomes a logged 500. */
export function toErrorResponse(err: unknown): NextResponse {
    if (err instanceof ServiceError) {
        return NextResponse.json(err.payload, { status: err.status });
    }
    console.error("Unhandled route error:", err);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
}

type RouteHandler = (req: Request) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a route handler so any thrown ServiceError is mapped to its response
 * and unexpected errors become a 500. Lets handlers read as a straight-line
 * happy path.
 */
export function route(handler: RouteHandler): (req: Request) => Promise<NextResponse> {
    return async (req: Request) => {
        try {
            return await handler(req);
        } catch (err) {
            return toErrorResponse(err);
        }
    };
}
