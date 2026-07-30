"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createUserAccount, type CreateUserState } from "./actions";

const field =
    "mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";
const label = "block text-xs font-bold uppercase tracking-wider text-slate-500";

function genPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let password = "";
    for (let i = 0; i < 10; i++) password += chars[Math.floor(Math.random() * chars.length)];
    return password + "#" + Math.floor(Math.random() * 90 + 10);
}

export function NewUserForm() {
    const [state, action, pending] = useActionState<CreateUserState, FormData>(createUserAccount, {});
    const [password, setPassword] = useState("");

    if (state.ok) {
        return (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                <h2 className="text-sm font-bold text-emerald-800">Akun berhasil dibuat</h2>
                <p className="mt-1 text-sm text-emerald-700">Bagikan kredensial ini ke yang bersangkutan karena hanya muncul sekali:</p>
                <div className="mt-4 space-y-2 rounded-lg border border-emerald-200 bg-white p-4 font-mono text-sm">
                    <div>
                        <span className="text-slate-400">Email:</span> <strong>{state.email}</strong>
                    </div>
                    <div>
                        <span className="text-slate-400">Password:</span> <strong>{state.password}</strong>
                    </div>
                    <div>
                        <span className="text-slate-400">Login di:</span> https://plusthe.site/admin/login
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Link href="/admin/users/new" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                        Buat lagi
                    </Link>
                    <Link href="/admin/users" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                        Selesai
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <form action={action} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {state.error && <div className="rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{state.error}</div>}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className={label}>Nama *</label>
                    <input name="name" required className={field} placeholder="Nama lengkap" />
                </div>
                <div>
                    <label className={label}>Role *</label>
                    <select name="role" defaultValue="sales" className={field}>
                        <option value="sales">Sales</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={label}>Email login *</label>
                <input name="email" type="email" required className={field} placeholder="nama@plusthe.site" />
            </div>
            <div>
                <label className={label}>Password *</label>
                <div className="mt-1 flex gap-2">
                    <input
                        name="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${field} mt-0 font-mono`}
                        placeholder="Min. 8 karakter"
                    />
                    <button
                        type="button"
                        onClick={() => setPassword(genPassword())}
                        className="shrink-0 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Buat Acak
                    </button>
                </div>
                <p className="mt-1 text-xs text-slate-400">Klik Buat Acak untuk membuat password aman, lalu salin dan bagikan.</p>
            </div>

            <div className="flex justify-end gap-2">
                <Link href="/admin/users" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    Batal
                </Link>
                <button disabled={pending} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                    {pending ? "Membuat..." : "Buat Akun"}
                </button>
            </div>
        </form>
    );
}
