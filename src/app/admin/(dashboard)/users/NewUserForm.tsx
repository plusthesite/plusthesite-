"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createUserAccount, type CreateUserState } from "./actions";

const field =
  "mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100";
const label =
  "block text-xs font-bold uppercase tracking-[0.18em] text-slate-500";

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 10; i += 1) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${password}#${Math.floor(Math.random() * 90 + 10)}`;
}

export function NewUserForm() {
  const [state, action, pending] = useActionState<CreateUserState, FormData>(
    createUserAccount,
    {},
  );
  const [password, setPassword] = useState("");

  if (state.ok) {
    return (
      <div className="rounded-[1.75rem] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 p-6 shadow-sm">
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
          Account ready
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-900">
          Akun baru berhasil dibuat
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Kredensial di bawah ini hanya tampil sekali. Kirim ke user terkait
          sekarang agar proses onboarding tidak terhambat.
        </p>

        <div className="mt-5 rounded-[1.5rem] border border-emerald-200/70 bg-white/90 p-5 shadow-sm">
          <div className="grid gap-4 text-sm font-mono sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Email
              </p>
              <p className="mt-2 break-all font-semibold text-slate-800">
                {state.email}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Password
              </p>
              <p className="mt-2 break-all font-semibold text-slate-800">
                {state.password}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Login URL
              </p>
              <p className="mt-2 break-all font-semibold text-slate-800">
                https://plusthe.site/admin/login
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/admin/users/new"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Buat lagi
          </Link>
          <Link
            href="/admin/users"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Kembali ke users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="space-y-5 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      {state.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {state.error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Profil dasar
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Nama *</label>
            <input
              name="name"
              required
              className={field}
              placeholder="Nama lengkap"
            />
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
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
          Login credentials
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className={label}>Email login *</label>
            <input
              name="email"
              type="email"
              required
              className={field}
              placeholder="nama@plusthe.site"
            />
          </div>

          <div>
            <label className={label}>Password *</label>
            <div className="mt-1 flex flex-col gap-2 sm:flex-row">
              <input
                name="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${field} mt-0 font-mono`}
                placeholder="Min. 8 karakter"
              />
              <button
                type="button"
                onClick={() => setPassword(genPassword())}
                className="shrink-0 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              >
                Buat acak
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Generate password aman, lalu bagikan kredensial ke user setelah
              akun selesai dibuat.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Link
          href="/admin/users"
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          Batal
        </Link>
        <button
          disabled={pending}
          className="rounded-xl bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
        >
          {pending ? "Membuat..." : "Buat akun"}
        </button>
      </div>
    </form>
  );
}
