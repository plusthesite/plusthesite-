// Pure, client-safe RBAC access rules (no server imports).
export type Role = "admin" | "manager" | "sales";

// Path prefixes each non-admin role may reach. `admin` = everything.
const ACCESS: Record<Exclude<Role, "admin">, string[]> = {
    manager: [
        "/admin/analytics", "/admin/posts", "/admin/accounts", "/admin/leads",
        "/admin/priority", "/admin/opportunities", "/admin/tasks", "/admin/playbook",
        "/admin/team", "/admin/subscribers", "/admin/contacts", "/admin/conversations",
        "/admin/search", "/admin/export",
    ],
    sales: [
        "/admin/analytics", "/admin/accounts", "/admin/leads", "/admin/priority",
        "/admin/opportunities", "/admin/tasks", "/admin/playbook", "/admin/search",
    ],
};

/** Can a role reach a given admin path? */
export function canAccess(role: Role, href: string): boolean {
    if (role === "admin") return true;
    if (href === "/admin") return true;
    return ACCESS[role].some((p) => href === p || href.startsWith(p + "/"));
}
