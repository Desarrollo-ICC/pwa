"use client";
import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, Save, X, ImagePlus, Loader2, Search } from "lucide-react";
import Image from "next/image";

interface Activity { id: number; season: string; category: string; name: string; description: string | null; price: string | null; active: boolean; image: string | null; }
interface RoomInfoItem { id?: number; section: string; content: string; }

const CATEGORIES_VERANO = [
  "Caminatas y Trekking",
  "Bicicleta",
  "Contemplación y Recreación",
  "Bienestar y Talleres Indoor",
  "Niños",
  "Otras Actividades",
];

const CATEGORIES_INVIERNO = [
  "Deportes de Nieve",
  "Exploración & Naturaleza",
  "Bienestar y Talleres Indoor",
  "Niños",
  "SKI – Renta por Día",
  "SKI – Renta Semanal",
  "SKI – Servicios",
];

const CATEGORIES = [...CATEGORIES_VERANO, ...CATEGORIES_INVIERNO];

const ALL_CAT_SECTIONS = [
  { season: "verano",   cats: CATEGORIES_VERANO },
  { season: "invierno", cats: CATEGORIES_INVIERNO },
];

const CAT_FALLBACKS: Record<string, string> = {
  "Caminatas y Trekkings":      "/images/actividades.jpg",
  "Bicicleta":                  "/images/actividades.jpg",
  "Contemplación y Recreación": "/images/login-bg.jpg",
  "Bienestar y Talleres":       "/images/spa.jpg",
  "Otras Actividades":          "/images/home-hero.jpg",
  "Centro de Ski":              "/images/actividades.jpg",
  "Deportes de Nieve":          "/images/actividades.jpg",
  "Exploración y Naturaleza":   "/images/login-bg.jpg",
  "Bienestar y Talleres Indoor":"/images/spa.jpg",
};

function catKey(cat: string) {
  return "act_cat_" + cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function EditModal({ item, onSave, onClose }: { item: Partial<Activity>; onSave: (d: Partial<Activity>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ ...item });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.url) {
      setForm(f => ({ ...f, image: json.url }));
    } else {
      setUploadError(json.error ?? "Error al subir imagen");
    }
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-900">{item.id ? "Editar actividad" : "Nueva actividad"}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Temporada</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]" value={form.season ?? "verano"} onChange={e => setForm(f => ({ ...f, season: e.target.value, category: undefined }))}>
              <option value="verano">Verano</option>
              <option value="invierno">Invierno</option>
            </select>
          </div>
          {[{ key: "category", label: "Categoría" }, { key: "name", label: "Nombre" }, { key: "description", label: "Descripción" }, { key: "price", label: "Precio (opcional)" }].map(f => (
            <div key={f.key}>
              <label className="text-[12px] font-semibold text-gray-600 mb-1 block">{f.label}</label>
              {f.key === "category" ? (
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]"
                  value={(form.category ?? "")}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  {(form.season === "invierno" ? CATEGORIES_INVIERNO : CATEGORIES_VERANO).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : f.key === "description" ? (
                <textarea rows={4} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px] resize-none" value={(form as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              ) : (
                <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-[14px]" value={(form as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              )}
            </div>
          ))}

          {/* Image upload */}
          <div>
            <label className="text-[12px] font-semibold text-gray-600 mb-1 block">Imagen</label>
            {form.image ? (
              <div className="relative rounded-xl overflow-hidden h-36 bg-gray-100">
                <Image src={form.image} alt="Preview" fill className="object-cover" />
                <button
                  onClick={() => setForm(f => ({ ...f, image: null }))}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:border-[#1B4332] hover:text-[#1B4332] transition-colors"
              >
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                <span className="text-[12px]">{uploading ? "Subiendo..." : "Subir imagen"}</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            {uploadError && <p className="text-red-500 text-[12px] mt-1">{uploadError}</p>}
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] font-medium text-gray-600">Cancelar</button>
          <button onClick={() => { setSaving(true); onSave(form); }} disabled={saving || uploading} className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2 disabled:opacity-60">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar</button>
        </div>
      </div>
    </div>
  );
}

export default function ActividadesAdminClient({ initialActivities, initialCatImages }: { initialActivities: Activity[]; initialCatImages: RoomInfoItem[] }) {
  const [season, setSeason] = useState<"verano" | "invierno">("verano");
  const [activities, setActivities] = useState(initialActivities);
  const [editing, setEditing] = useState<Partial<Activity> | null>(null);
  const [query, setQuery] = useState("");

  // Category images state
  const [catSeason, setCatSeason] = useState<"verano" | "invierno">("verano");
  const [catImages, setCatImages] = useState<RoomInfoItem[]>(initialCatImages);
  const [uploadingCat, setUploadingCat] = useState<string | null>(null);
  const [savedCat, setSavedCat] = useState<string | null>(null);

  const catRefs = Object.fromEntries(CATEGORIES.map(c => [c, useRef<HTMLInputElement>(null)]));

  const getCatImg = (cat: string) => catImages.find(i => i.section === catKey(cat))?.content ?? CAT_FALLBACKS[cat] ?? "/images/actividades.jpg";

  const handleCatUpload = (cat: string) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCat(cat);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upJson = await upRes.json();
    if (!upJson.url) { setUploadingCat(null); return; }
    const url = upJson.url;
    const key = catKey(cat);
    const existing = catImages.find(i => i.section === key);
    if (existing?.id) {
      await fetch("/api/admin/habitacion", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: existing.id, type: "info", section: key, title: cat, content: url }) });
      setCatImages(s => s.map(x => x.section === key ? { ...x, content: url } : x));
    } else {
      const res = await fetch("/api/admin/habitacion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "info", section: key, title: cat, content: url, order: 0 }) });
      const json = await res.json();
      setCatImages(s => [...s, json.info]);
    }
    setUploadingCat(null);
    setSavedCat(cat);
    setTimeout(() => setSavedCat(null), 2500);
  };

  const filtered = activities.filter(a => a.season === season);
  const byCategory = filtered.reduce<Record<string, Activity[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  const handleSave = async (data: Partial<Activity>) => {
    const isNew = !data.id;
    const res = await fetch("/api/admin/actividades", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { alert("Error al guardar. Intenta de nuevo."); return; }
    const json = await res.json();
    if (!json.activity) { alert("Error al guardar. Intenta de nuevo."); return; }
    if (isNew) setActivities(s => [...s, json.activity]);
    else setActivities(s => s.map(x => x.id === json.activity.id ? json.activity : x));
    setEditing(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta actividad?")) return;
    await fetch("/api/admin/actividades", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setActivities(s => s.filter(x => x.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-bold text-gray-900 mb-6">Experiencias y Actividades</h1>

      {/* ── Category images ── */}
      <div className="mb-7">
        <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imágenes de Categorías</h2>
        <div className="flex gap-2 mb-3">
          {(["verano", "invierno"] as const).map(s => (
            <button key={s} onClick={() => setCatSeason(s)} className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-all ${catSeason === s ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
              {s === "verano" ? "☀️ Verano" : "⛷️ Invierno"}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {(catSeason === "verano" ? CATEGORIES_VERANO : CATEGORIES_INVIERNO).map(cat => (
            <div key={cat} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={getCatImg(cat)} alt={cat} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-800">{cat}</p>
                {savedCat === cat
                  ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
                  : <p className="text-gray-400 text-[11px] mt-0.5">Imagen de portada de la categoría</p>}
              </div>
              <button
                type="button"
                onClick={() => catRefs[cat].current?.click()}
                disabled={uploadingCat === cat}
                className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0"
              >
                {uploadingCat === cat ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                {uploadingCat === cat ? "Subiendo..." : "Cambiar"}
              </button>
              <input ref={catRefs[cat]} type="file" accept="image/*" className="hidden" onChange={handleCatUpload(cat)} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {(["verano", "invierno"] as const).map(s => (
          <button key={s} onClick={() => setSeason(s)} className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all capitalize ${season === s ? "bg-[#1B4332] text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {s === "verano" ? "☀️ Verano" : "⛷️ Invierno"}
          </button>
        ))}
      </div>
      <button onClick={() => setEditing({ season, active: true })} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium mb-5">
        <Plus size={15} /> Agregar actividad
      </button>
      <div className="relative mb-5">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar actividad..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
      </div>
      {Object.entries(byCategory).map(([cat, acts]) => {
        const visible = query ? acts.filter(a => a.name.toLowerCase().includes(query.toLowerCase()) || (a.description ?? "").toLowerCase().includes(query.toLowerCase())) : acts;
        if (visible.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-2">{cat}</h2>
            <div className="flex flex-col gap-2">
              {visible.map(a => (
              <div key={a.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex justify-between items-start gap-3">
                <div className="flex-1 flex items-start gap-3">
                  {a.image && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={a.image} alt={a.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-[14px]">{a.name}</p>
                    {a.description && <p className="text-gray-400 text-[12px] mt-0.5 line-clamp-2 whitespace-pre-line">{a.description}</p>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(a)} className="p-1.5 text-gray-400 hover:text-gray-700"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            </div>
          </div>
        );
      })}
      {editing && <EditModal item={editing} onSave={handleSave} onClose={() => setEditing(null)} />}
    </div>
  );
}
