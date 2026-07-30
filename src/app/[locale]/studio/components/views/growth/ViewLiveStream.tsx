import React, { useState, useEffect, useRef, useCallback } from "react";
import { MonitorPlay, Eye, ShoppingBag, Mic, MicOff, Video, VideoOff, Settings, Send, Cast, Plus, Trash2, Loader2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LiveProduct { id: string; name: string; price: number; old_price?: number | null }

const rp = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

export const ViewLiveStream: React.FC<{ addNotification: (t: 'success' | 'error', m: string) => void }> = ({ addNotification }) => {
    const [isLive, setIsLive] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [camError, setCamError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [products, setProducts] = useState<LiveProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [featuredId, setFeaturedId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<{ user: string, msg: string, color: string }[]>([]);
    const [hostMsg, setHostMsg] = useState("");

    // Add-product form state
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", price: "", oldPrice: "" });

    // Load the signed-in seller's real product catalog (owner-scoped via RLS).
    const loadProducts = useCallback(async () => {
        if (!supabase) { setLoadingProducts(false); return; }
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setLoadingProducts(false); return; }
        const { data } = await supabase.from('live_products').select('id, name, price, old_price, created_at').order('created_at', { ascending: false });
        if (data) {
            setProducts(data as LiveProduct[]);
            setFeaturedId(prev => prev ?? (data[0]?.id ?? null));
        }
        setLoadingProducts(false);
    }, []);
    useEffect(() => { loadProducts(); }, [loadProducts]);

    const sendHostMessage = () => {
        const text = hostMsg.trim();
        if (!text) return;
        setChatMessages(prev => [...prev.slice(-9), { user: "Host", msg: text, color: "bg-primary" }]);
        setHostMsg("");
    };

    const addProduct = async () => {
        const name = form.name.trim();
        const price = parseInt(form.price.replace(/\D/g, ""), 10);
        const oldPrice = form.oldPrice.trim() ? parseInt(form.oldPrice.replace(/\D/g, ""), 10) : null;
        if (!name) { addNotification('error', 'Nama produk wajib diisi.'); return; }
        if (!Number.isFinite(price) || price <= 0) { addNotification('error', 'Harga harus angka lebih dari 0.'); return; }
        if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice <= price)) { addNotification('error', 'Harga coret harus lebih besar dari harga jual.'); return; }
        if (!supabase) { addNotification('error', 'Database tidak tersedia.'); return; }

        setSaving(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { addNotification('error', 'Sesi habis. Login ulang.'); setSaving(false); return; }
        const { data, error } = await supabase.from('live_products')
            .insert([{ user_id: session.user.id, name, price, old_price: oldPrice }])
            .select('id, name, price, old_price, created_at').single();
        setSaving(false);
        if (error || !data) { addNotification('error', 'Gagal menyimpan produk.'); return; }
        const created = data as LiveProduct;
        setProducts(prev => [created, ...prev]);
        setFeaturedId(prev => prev ?? created.id);
        setForm({ name: "", price: "", oldPrice: "" });
        setShowForm(false);
        addNotification('success', `"${created.name}" ditambahkan ke katalog.`);
    };

    const removeProduct = async (id: string) => {
        if (!supabase) return;
        const prevProducts = products;
        setProducts(prev => prev.filter(p => p.id !== id));
        if (featuredId === id) setFeaturedId(prevProducts.find(p => p.id !== id)?.id ?? null);
        const { error } = await supabase.from('live_products').delete().eq('id', id);
        if (error) { setProducts(prevProducts); addNotification('error', 'Gagal menghapus produk.'); }
    };

    const featured = products.find(p => p.id === featuredId) ?? null;

    // Acquire a real camera/mic preview while live; release it when going offline.
    useEffect(() => {
        if (!isLive) {
            streamRef.current?.getTracks().forEach(t => t.stop());
            streamRef.current = null;
            if (videoRef.current) videoRef.current.srcObject = null;
            setCamError(null);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
                streamRef.current = stream;
                stream.getVideoTracks().forEach(t => { t.enabled = camOn; });
                stream.getAudioTracks().forEach(t => { t.enabled = micOn; });
                if (videoRef.current) videoRef.current.srcObject = stream;
                setCamError(null);
            } catch {
                if (!cancelled) setCamError('Gagal mengakses kamera/mikrofon. Periksa izin browser.');
            }
        })();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive]);

    // Mute/unmute existing tracks without re-requesting permission.
    useEffect(() => { streamRef.current?.getVideoTracks().forEach(t => { t.enabled = camOn; }); }, [camOn]);
    useEffect(() => { streamRef.current?.getAudioTracks().forEach(t => { t.enabled = micOn; }); }, [micOn]);
    useEffect(() => () => { streamRef.current?.getTracks().forEach(t => t.stop()); }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-24 animate-in fade-in duration-500 h-full lg:h-[calc(100vh-140px)]">
            {/* Main Stream Area */}
            <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                <div id="live-preview" className="bg-black border border-white/10 rounded-2xl flex-1 relative overflow-hidden group shadow-2xl min-h-[400px]">
                    {/* Real local camera/mic preview */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
                        {isLive && camOn && !camError && (
                            <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover [transform:scaleX(-1)]" />
                        )}
                        {isLive ? (
                            camError ? (
                                <div className="text-center opacity-80 px-6">
                                    <VideoOff size={48} className="mx-auto mb-2 text-red-400" />
                                    <p className="text-red-300 font-bold text-sm">{camError}</p>
                                </div>
                            ) : !camOn ? (
                                <div className="text-center opacity-70">
                                    <VideoOff size={48} className="mx-auto mb-2 text-slate-400" />
                                    <p className="text-slate-300 font-bold">Kamera dimatikan</p>
                                </div>
                            ) : null
                        ) : (
                            <div className="text-center opacity-50">
                                <MonitorPlay size={48} className="mx-auto mb-2 text-slate-500" />
                                <p className="text-slate-400">Stream Offline</p>
                            </div>
                        )}
                    </div>

                    {/* Overlays */}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                        <span className="text-xs font-bold text-white">{isLive ? 'LIVE' : 'OFFLINE'}</span>
                    </div>
                    {isLive && <div className="absolute top-4 right-4 flex gap-2 animate-in fade-in">
                        {!micOn && <div className="bg-black/50 backdrop-blur p-1.5 rounded-full border border-white/10"><MicOff size={14} className="text-red-400" /></div>}
                        <div className="bg-black/50 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                            <Eye size={14} className="text-white" />
                            <span className="text-xs font-bold text-white">Pratinjau Lokal</span>
                        </div>
                    </div>}

                    {/* Product Pop-up Overlay (preview of featured pinned product) */}
                    {isLive && featured && (
                        <div className="absolute bottom-6 left-6 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-xl flex gap-3 items-center max-w-xs animate-in slide-in-from-left shadow-xl">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center"><ShoppingBag className="text-black" size={20} /></div>
                            <div><p className="text-xs font-bold text-white">{featured.name}</p><p className="text-xs text-yellow-400 font-bold">{rp(featured.price)} {featured.old_price && <span className="line-through text-slate-400 ml-1 font-normal">{rp(featured.old_price)}</span>}</p></div>
                            <span className="bg-brand/20 text-brand text-[10px] font-bold px-3 py-1.5 rounded-lg ml-auto">Pinned</span>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="bg-card-bg border border-border p-4 rounded-xl flex justify-between items-center shadow-lg transition-colors">
                    <div className="flex gap-4">
                        <button onClick={() => { setMicOn(m => !m); addNotification('success', micOn ? 'Mikrofon dimatikan' : 'Mikrofon aktif'); }} title={micOn ? 'Matikan mikrofon' : 'Aktifkan mikrofon'} className={`p-3 rounded-lg transition-colors relative shadow-sm ${micOn ? 'bg-surface-hover hover:bg-surface text-foreground' : 'bg-red-500/15 text-red-500 hover:bg-red-500/25'}`}>
                            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                            {micOn && <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full border border-surface"></span>}
                        </button>
                        <button onClick={() => { setCamOn(c => !c); addNotification('success', camOn ? 'Kamera dimatikan' : 'Kamera aktif'); }} title={camOn ? 'Matikan kamera' : 'Aktifkan kamera'} className={`p-3 rounded-lg transition-colors shadow-sm ${camOn ? 'bg-surface-hover hover:bg-surface text-foreground' : 'bg-red-500/15 text-red-500 hover:bg-red-500/25'}`}>
                            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                        </button>
                        <button onClick={() => addNotification('success', 'Pengaturan stream tersimpan.')} title="Pengaturan" className="p-3 bg-surface-hover rounded-lg hover:bg-surface text-foreground transition-colors shadow-sm"><Settings size={20} /></button>
                    </div>
                    <button onClick={() => { setIsLive(!isLive); addNotification('success', isLive ? 'Stream Ended' : 'You are Live!'); }} className={`px-8 py-3 rounded-lg font-bold transition-all shadow-lg text-white ${isLive ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-tertiary hover:bg-tertiary-light shadow-green-900/20'}`}>
                        {isLive ? 'End Stream' : 'Go Live'}
                    </button>
                </div>
            </div>

            {/* Sidebar: Chat & Products */}
            <div className="flex flex-col gap-4 h-full">
                <div className="bg-card-bg border border-border rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg transition-colors min-h-[300px]">
                    <div className="p-3 border-b border-border bg-surface">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Live Chat</h4>
                        <p className="text-[10px] text-muted mt-0.5">Mode rehearsal untuk host: cek alur kamera, chat, dan pin produk sebelum siaran publik</p>
                    </div>
                    <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                        {chatMessages.length === 0 && (
                            <p className="py-6 text-center text-[11px] text-muted">Belum ada percakapan rehearsal. Kirim pesan sebagai host untuk menguji alur siaran.</p>
                        )}
                        {chatMessages.map((c, i) => (
                            <div key={i} className="flex gap-2 items-start animate-in slide-in-from-bottom-2">
                                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white ${c.color}`}>{c.user.charAt(0)}</div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-light">{c.user}</p>
                                    <p className="text-xs text-foreground">{c.msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-border bg-surface flex gap-2">
                        <input value={hostMsg} onChange={e => setHostMsg(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') sendHostMessage(); }} placeholder="Tulis simulasi pesan host..." className="bg-background border border-border text-foreground text-xs rounded-lg px-3 py-2 flex-1 outline-none focus:ring-1 focus:ring-primary transition-all" />
                        <button onClick={sendHostMessage} disabled={!hostMsg.trim()} className="bg-primary hover:bg-primary-dark p-2 rounded-lg text-white transition-colors disabled:opacity-50"><Send size={14} /></button>
                    </div>
                </div>

                <div id="live-products" className="bg-card-bg border border-border rounded-2xl h-1/3 flex flex-col overflow-hidden shadow-lg transition-colors min-h-[150px]">
                    <div className="p-3 border-b border-border bg-surface flex justify-between items-center">
                        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Katalog Produk <span className="text-muted font-normal">({products.length})</span></h4>
                        <button onClick={() => setShowForm(v => !v)} className="text-[10px] text-primary hover:text-primary-light transition-colors flex items-center gap-1">
                            {showForm ? <><X size={12} /> Tutup</> : <><Plus size={12} /> Tambah</>}
                        </button>
                    </div>

                    {showForm && (
                        <div className="p-3 border-b border-border bg-background/50 space-y-2 animate-in slide-in-from-top-2">
                            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama produk" className="w-full bg-background border border-border text-foreground text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary" />
                            <div className="flex gap-2">
                                <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} inputMode="numeric" placeholder="Harga jual" className="w-1/2 bg-background border border-border text-foreground text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary" />
                                <input value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} inputMode="numeric" placeholder="Harga coret (opsional)" className="w-1/2 bg-background border border-border text-foreground text-xs rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary" />
                            </div>
                            <button onClick={addProduct} disabled={saving} className="w-full bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg py-2 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5">
                                {saving ? <><Loader2 size={13} className="animate-spin" /> Menyimpan...</> : <><Plus size={13} /> Simpan Produk</>}
                            </button>
                        </div>
                    )}

                    <div className="p-3 overflow-y-auto space-y-2 custom-scrollbar flex-1">
                        {loadingProducts ? (
                            <p className="py-4 text-center text-[11px] text-muted flex items-center justify-center gap-1.5"><Loader2 size={13} className="animate-spin" /> Memuat katalog...</p>
                        ) : products.length === 0 ? (
                            <p className="py-4 text-center text-[11px] text-muted">Katalog masih kosong. Tambahkan produk pertama agar pin showcase siap saat siaran dimulai.</p>
                        ) : products.map(p => {
                            const isFeatured = p.id === featuredId;
                            return (
                                <div key={p.id} className={`flex gap-3 p-2 rounded-lg border shadow-sm transition-colors group ${isFeatured ? 'bg-primary/5 border-primary' : 'bg-surface-hover border-border'}`}>
                                    <div className="w-10 h-10 bg-background rounded flex items-center justify-center shrink-0"><ShoppingBag size={16} className="text-foreground" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-foreground truncate">{p.name}</p>
                                        <p className="text-[10px] text-muted">{rp(p.price)}{p.old_price && <span className="line-through ml-1">{rp(p.old_price)}</span>}{isFeatured && <span className="ml-1 text-primary font-bold">· tampil</span>}</p>
                                    </div>
                                    <button onClick={() => setFeaturedId(p.id)} title="Tampilkan di layar" className={`transition-colors ${isFeatured ? 'text-primary' : 'text-muted hover:text-primary'}`}><Cast size={16} /></button>
                                    <button onClick={() => removeProduct(p.id)} title="Hapus" className="text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
