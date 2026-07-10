import { cookies } from "next/headers";
import { COOKIE, type NalarRole } from "./auth";

export interface NalarSession {
    user: string;
    role: NalarRole;
    nama: string;
    employeeId?: string;
}

export async function getSession(): Promise<NalarSession | null> {
    const jar = await cookies();
    const raw = jar.get(COOKIE)?.value;
    if (!raw) return null;
    try {
        const s = JSON.parse(raw) as NalarSession;
        if (s && s.role) return s;
    } catch {
        /* ignore malformed cookie */
    }
    return null;
}
