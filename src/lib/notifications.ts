/**
 * Compatibility shim. The implementation moved to the server layer
 * (`@/server/services/notificationService`). Existing imports of
 * `@/lib/notifications` keep working; new code should import from the service.
 */
export { createNotification } from "@/server/services/notificationService";
export type { NotificationInput } from "@/server/repositories/notificationRepo";
