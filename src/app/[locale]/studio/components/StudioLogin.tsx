import React, { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { useTheme } from "@/components/ThemeProvider";
import { supabase } from "@/lib/supabase";
import { useLocale } from "@/i18n/I18nProvider";

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v2.99h3.87c2.27-2.09 3.57-5.17 3.57-8.63Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.87-2.99c-1.07.72-2.45 1.14-4.08 1.14-3.13 0-5.79-2.12-6.73-4.96H1.27v3.08A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.55.37-2.29V6.63H1.27A12 12 0 0 0 0 12c0 1.94.46 3.78 1.27 5.37l4-3.08Z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.27 6.63l4 3.08C6.21 6.89 8.87 4.77 12 4.77Z" />
        </svg>
    );
}

const StudioLoginLogo = () => {
    const { theme } = useTheme();
    return <Logo variant={theme === 'dark' ? 'light' : 'dark'} size="large" className="mx-auto" />;
};

export const StudioLogin: React.FC<{ onLoginSuccess: () => void, onBack: () => void }> = ({ onLoginSuccess, onBack }) => {
    const locale = useLocale();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [isResetMode, setIsResetMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const resetState = () => {
        setErrorMessage("");
        setSuccessMessage("");
        setEmail("");
        setPassword("");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        if (!supabase) {
            setLoading(false);
            setErrorMessage("Autentikasi belum dikonfigurasi. Hubungi admin untuk mengatur Supabase.");
            return;
        }

        if (isResetMode) {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/${locale}/studio`,
            });
            setLoading(false);
            if (error) {
                setErrorMessage(error.message);
            } else {
                setSuccessMessage("Email reset password telah dikirim. Silakan cek inbox Anda.");
                setEmail("");
            }
            return;
        }

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({ email, password });
            setLoading(false);
            if (error) {
                setErrorMessage(error.message);
            } else {
                setSuccessMessage("Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk melakukan verifikasi akun.");
                setEmail("");
                setPassword("");
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setLoading(false);
            if (error) {
                setErrorMessage(error.message);
            } else {
                onLoginSuccess();
            }
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setErrorMessage("");

        if (!supabase) {
            setLoading(false);
            setErrorMessage("Autentikasi belum dikonfigurasi. Hubungi admin untuk mengatur Supabase.");
            return;
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/${locale}/studio`,
            },
        });
        if (error) {
            setLoading(false);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden text-slate-900 dark:text-white transition-colors duration-500">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/8 dark:bg-blue-500/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-purple-500/8 dark:bg-purple-500/5 rounded-full blur-[100px]"></div>
            </div>

            <button onClick={onBack} className="absolute top-8 left-8 p-2 rounded-full bg-white dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white z-20 border border-slate-200 dark:border-slate-800 shadow-sm">
                <ArrowRight className="rotate-180" size={24} />
            </button>

            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-24"><StudioLoginLogo /></div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {isResetMode ? "Reset Password" : isSignUp ? "Create Account" : "Welcome Back"}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                        {isResetMode
                            ? "Masukkan email Anda untuk menerima tautan reset password."
                            : isSignUp
                            ? "Daftar untuk membuat kampanye baru Anda."
                            : "Masuk untuk melanjutkan kampanye Anda."}
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    {errorMessage && (
                        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 p-4 text-xs text-rose-600 dark:text-rose-400">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 p-4 text-xs text-emerald-600 dark:text-emerald-400">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                    </div>

                    {!isResetMode && (
                        <div>
                            <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                        </div>
                    )}

                    {!isSignUp && !isResetMode && (
                        <div className="flex justify-between items-center text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-500 dark:text-slate-400">
                                <input type="checkbox" className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-500 focus:ring-blue-500" /> Remember me
                            </label>
                            <button
                                type="button"
                                onClick={() => { setIsResetMode(true); resetState(); }}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-bold"
                            >
                                Lupa Password?
                            </button>
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? <Loader2 className="animate-spin" size={20} /> : isResetMode ? "Kirim Email Reset" : isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </form>

                {!isResetMode && (
                    <>
                        <div className="my-8 flex items-center gap-4">
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">ATAU</span>
                            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
                        </div>
                        <div className="space-y-3">
                            <button onClick={handleGoogleLogin} disabled={loading} className="w-full py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-3 disabled:opacity-70">
                                <GoogleIcon />
                                Masuk dengan Google
                            </button>
                        </div>
                    </>
                )}

                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
                    {isResetMode ? (
                        <button onClick={() => { setIsResetMode(false); resetState(); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                            ← Kembali ke Login
                        </button>
                    ) : isSignUp ? (
                        <>
                            Sudah punya akun?{" "}
                            <button onClick={() => { setIsSignUp(false); resetState(); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                Masuk Sekarang
                            </button>
                        </>
                    ) : (
                        <>
                            Belum punya akun?{" "}
                            <button onClick={() => { setIsSignUp(true); resetState(); }} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                Daftar Sekarang
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};
