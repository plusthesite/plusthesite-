/**
 * Compatibility shim. The dashboard stats implementation moved to the server
 * layer (`@/server/services/statsService`, backed by `statsRepo`). Existing
 * imports of `@/lib/adminStats` keep working; new code should import from the
 * service directly.
 */
export { getDashboardStats, type DashboardStats } from "@/server/services/statsService";
