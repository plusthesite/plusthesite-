import React, { useState, useEffect, useCallback } from "react";
import { Megaphone, Filter, Search, Star, ShieldCheck, Check, Trash2, Bookmark, X, Copy, Users2, Wallet, Loader2 } from "lucide-react";
import { KOL } from "@/types";
import { supabase } from "@/lib/supabase";

interface ShortlistRow { id: string; kol_id: string; kol_name: string; handle: string | null; status: string }

const rp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export const ViewKOL: React.FC<{ addNotification: (t: 'success' | 'error', m: string) => void }> = ({ addNotification }) => {
    const [filters, setFilters] = useState({ cat: 'All', price: 'All', search: '' });
    const [shortlist, setShortlist] = useState<ShortlistRow[]>([]);
    const [showBrief, setShowBrief] = useState(false);
    const [kols, setKols] = useState<KOL[]>([]);
    const [kolsLoading, setKolsLoading] = useState(true);

    // Load the shared KOL catalog.
    const loadKOLs = useCallback(async () => {
        setKolsLoading(true);
        if (!supabase) { setKolsLoading(false); return; }
        const { data } = await supabase.from('studio_kols')
            .select('id, name, handle, category, followers, er, price, tags, verified')
            .order('created_at', { ascending: true });
        if (data) setKols(data as KOL[]);
        setKolsLoading(false);
    }, []);
    useEffect(() => { loadKOLs(); }, [loadKOLs]);

    // Load the signed-in user's saved KOL shortlist.
    const loadShortlist = useCallback(async () => {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data } = await supabase.from('studio_kol_shortlist')
            .select('id, kol_id, kol_name, handle, status')
            .order('created_at', { ascending: false });
        if (data) setShortlist(data as ShortlistRow[]);
    }, []);
    useEffect(() => { loadShortlist(); }, [loadShortlist]);

    const savedIds = new Set(shortlist.map((s) => s.kol_id));

    const handleContact = async (k: KOL) => {
        if (!supabase) { addNotification('error', 'Studio belum terhubung ke database.'); return; }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { addNotification('error', 'Masuk dulu untuk menyimpan ke shortlist.'); return; }
        if (savedIds.has(String(k.id))) { addNotification('success', `${k.name} sudah ada di shortlist.`); return; }
        const { data: ins, error } = await supabase.from('studio_kol_shortlist').insert([{
            user_id: session.user.id,
            kol_id: String(k.id),
            kol_name: k.name,
            handle: k.handle,
            status: 'contacted',
        }]).select('id, kol_id, kol_name, handle, status').single();
        if (error) { addNotification('error', 'Gagal menyimpan, coba lagi.'); return; }
        if (ins) { setShortlist((s) => [ins as ShortlistRow, ...s]); addNotification('success', `${k.name} masuk shortlist & proposal disiapkan.`); }
    };

    const removeFromShortlist = async (id: string) => {
        if (!supabase) return;
        await supabase.from('studio_kol_shortlist').delete().eq('id', id);
        setShortlist((s) => s.filter((x) => x.id !== id));
    };

    // Brief built from the shortlist (cross-referenced with the catalog for price/reach).
    const briefRows = shortlist.map((s) => {
        const k = kols.find((m) => String(m.id) === s.kol_id);
        return { name: s.kol_name, handle: s.handle ?? '', price: k?.price ?? 0, followers: k?.followers ?? '—' };
    });
    const totalBudget = briefRows.reduce((a, b) => a + b.price, 0);

    const openCampaign = () => {
        if (shortlist.length === 0) { addNotification('error', 'Tambahkan KOL ke shortlist dulu (tombol Kontak).'); return; }
        setShowBrief(true);
    };

    const copyBrief = async () => {
        const text = [
            'BRIEF KAMPANYE KOL',
            `Jumlah KOL: ${briefRows.length}`,
            `Estimasi budget (mulai dari): ${rp(totalBudget)}`,
            '',
            ...briefRows.map((r) => `• ${r.name} (${r.handle}) — ${r.followers} followers — mulai ${rp(r.price)}`),
        ].join('\n');
        try { await navigator.clipboard.writeText(text); addNotification('success', 'Brief disalin ke clipboard.'); }
        catch { addNotification('error', 'Gagal menyalin brief.'); }
    };

    const filtered = kols.filter(k =>
        (filters.cat === 'All' || k.category === filters.cat) &&
        (filters.price === 'All' || (filters.price === 'Micro' ? k.price < 500000 : k.price >= 500000)) &&
        k.name.toLowerCase().includes(filters.search.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"><h2 className="text-2xl font-bold text-slate-800 dark:text-white">KOL Collaboration</h2><button onClick={openCampaign} className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg font-bold text-sm flex gap-2 shadow-lg hover:shadow-yellow-600/20 transition-all transform hover:-translate-y-0.5"><Megaphone size={16} /> Kampanye Baru</button></div>

            {/* Saved shortlist */}
            {shortlist.length > 0 && (
                <div className="bg-card-bg border border-border p-5 rounded-2xl shadow-lg transition-colors">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Bookmark size={18} className="text-primary fill-primary/20" /> Shortlist Anda · tersimpan otomatis <span className="ml-1 text-xs font-normal text-muted">({shortlist.length})</span></h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {shortlist.map((s) => (
                            <div key={s.id} className="flex items-center gap-3 bg-surface border border-border rounded-xl p-3 group">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">{s.kol_name?.substring(0, 2)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-foreground truncate">{s.kol_name}</p>
                                    <p className="text-[10px] text-primary truncate">{s.handle}</p>
                                </div>
                                <span className="text-[9px] uppercase font-bold text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full shrink-0">{s.status}</span>
                                <button onClick={() => removeFromShortlist(s.id)} title="Hapus dari shortlist" className="text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Filter Section */}
            <div id="kol-filter" className="bg-card-bg backdrop-blur-sm p-4 rounded-xl border border-border flex flex-col md:flex-row gap-4 items-center shadow-lg transition-colors">
                <div className="flex items-center gap-2 text-muted font-bold"><Filter size={16} /> Filter:</div>
                <select onChange={e => setFilters({ ...filters, cat: e.target.value })} className="bg-surface border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:border-primary outline-none hover:bg-surface-hover transition-colors cursor-pointer w-full md:w-auto">
                    <option value="All">Semua Kategori</option>
                    <option value="F&B">F&B</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Technology">Technology</option>
                </select>
                <select onChange={e => setFilters({ ...filters, price: e.target.value })} className="bg-surface border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:border-primary outline-none hover:bg-surface-hover transition-colors cursor-pointer w-full md:w-auto">
                    <option value="All">Semua Harga</option>
                    <option value="Micro">Micro (&lt;500rb)</option>
                    <option value="Macro">Macro (&gt;500rb)</option>
                </select>
                <div className="flex-1 relative w-full">
                    <Search className="absolute left-3 top-2.5 text-muted-light" size={16} />
                    <input onChange={e => setFilters({ ...filters, search: e.target.value })} type="text" placeholder="Cari influencer..." className="w-full bg-surface border border-border text-foreground text-sm rounded-lg pl-9 pr-4 py-2 focus:border-primary outline-none hover:bg-surface-hover transition-colors" />
                </div>
            </div>

            {/* KOL Cards */}
            {kolsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 bg-surface animate-pulse rounded-2xl border border-border" />)}
                </div>
            ) : !supabase ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 bg-card-bg border border-dashed border-border rounded-2xl text-center">
                    <Loader2 size={28} className="text-muted-light" />
                    <p className="text-sm text-muted max-w-xs">Katalog KOL belum terhubung ke database.</p>
                </div>
            ) : kols.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 bg-card-bg border border-dashed border-border rounded-2xl text-center">
                    <Users2 size={28} className="text-muted-light" />
                    <p className="text-sm text-muted max-w-xs">Belum ada KOL di katalog.</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-16 bg-card-bg border border-dashed border-border rounded-2xl text-center">
                    <Search size={28} className="text-muted-light" />
                    <p className="text-sm text-muted max-w-xs">Tidak ada KOL yang cocok dengan filter.</p>
                </div>
            ) : (
            <div id="kol-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(k => {
                    const saved = savedIds.has(String(k.id));
                    return (
                    <div key={k.id} className="bg-card-bg border border-border p-5 rounded-2xl relative group hover:border-primary/50 transition-all hover:bg-surface-hover hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute top-4 right-4 text-yellow-500"><Star size={16} /></div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-full p-0.5 shadow-lg">
                                <div className="w-full h-full bg-background rounded-full flex items-center justify-center text-lg font-bold text-foreground uppercase">{k.name.substring(0, 2)}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1"><h4 className="text-foreground font-bold">{k.name}</h4>{k.verified && <ShieldCheck size={14} className="text-primary fill-primary/20" />}</div>
                                <p className="text-xs text-primary">{k.handle}</p>
                                <div className="flex gap-1 mt-1">{k.tags.map((t, i) => <span key={i} className="text-[10px] bg-surface-hover px-2 py-0.5 rounded-full text-muted">{t}</span>)}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-surface rounded-xl border border-border">
                            <div className="text-center">
                                <p className="text-[10px] text-muted uppercase font-bold">Followers</p>
                                <p className="text-foreground font-bold text-sm">{k.followers}</p>
                            </div>
                            <div className="text-center border-l border-border">
                                <p className="text-[10px] text-muted uppercase font-bold">ER</p>
                                <p className="text-tertiary font-bold text-sm">{k.er}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div><p className="text-[10px] text-muted">Mulai dari</p><p className="text-foreground font-bold">Rp {k.price.toLocaleString()}</p></div>
                            <button onClick={() => handleContact(k)} disabled={saved} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors shadow-lg flex items-center gap-1.5 ${saved ? 'bg-tertiary/15 text-tertiary cursor-default' : 'bg-primary hover:bg-primary-dark text-white'}`}>{saved ? <><Check size={13} /> Di Shortlist</> : 'Kontak'}</button>
                        </div>
                    </div>
                    );
                })}
            </div>
            )}

            {/* Campaign brief modal */}
            {showBrief && (
                <div onClick={() => setShowBrief(false)} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg bg-card-bg border border-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                            <h3 className="font-bold text-foreground flex items-center gap-2"><Megaphone size={18} className="text-yellow-500" /> Brief Kampanye KOL</h3>
                            <button onClick={() => setShowBrief(false)} className="text-muted hover:text-foreground transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-surface border border-border rounded-xl p-4">
                                    <p className="text-[10px] uppercase font-bold text-muted flex items-center gap-1"><Users2 size={12} /> Jumlah KOL</p>
                                    <p className="mt-1 text-2xl font-black text-foreground">{briefRows.length}</p>
                                </div>
                                <div className="bg-surface border border-border rounded-xl p-4">
                                    <p className="text-[10px] uppercase font-bold text-muted flex items-center gap-1"><Wallet size={12} /> Estimasi Budget</p>
                                    <p className="mt-1 text-2xl font-black text-primary">{rp(totalBudget)}</p>
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
                                {briefRows.map((r, i) => (
                                    <div key={i} className="flex items-center gap-3 bg-surface border border-border rounded-lg p-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">{r.name.substring(0, 2)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{r.name}</p>
                                            <p className="text-[10px] text-muted truncate">{r.handle} · {r.followers} followers</p>
                                        </div>
                                        <p className="text-xs font-bold text-foreground shrink-0">{rp(r.price)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-border flex gap-3">
                            <button onClick={copyBrief} className="flex-1 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"><Copy size={15} /> Salin Brief</button>
                            <button onClick={() => setShowBrief(false)} className="px-5 py-2.5 bg-surface border border-border text-foreground text-sm font-bold rounded-lg hover:bg-surface-hover transition-colors">Tutup</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
