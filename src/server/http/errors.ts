/**
 * Pure error types for the server layer - no framework imports, so validators
 * and services that throw these stay unit-testable without loading `next`.
 */

/**
 * Error a service (or validator) throws to short-circuit a request with an
 * exact HTTP response. The `payload` is returned verbatim as JSON so callers
 * keep full control over the response contract.
 */
export class ServiceError extends Error {
    readonly status: number;
    readonly payload: unknown;

    constructor(status: number, payload: unknown) {
        super(`ServiceError ${status}`);
        this.name = "ServiceError";
        this.status = status;
        this.payload = payload;
    }
}
