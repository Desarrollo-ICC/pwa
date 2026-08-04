"use client";
import { useRef, useState } from "react";
import { Pencil, Trash2, Plus, X, Save, ImagePlus, Loader2, Search } from "lucide-react";
import Image from "next/image";

interface InfoItem { id: number; section: string; title: string; content: string; active: boolean; }
interface HeroInfo { id?: number; content: string; }


// Section keys → display labels (must match the guest page section order)
const SECTION_LABELS: Record<string, string> = {
  housekeeping: "Servicios de Aseo",
  lavanderia: "Lavandería",
  caja: "Caja de Seguridad",
  minibar: "Minibar",
  room_service: "Room Service",
  almohadas: "Menú de Almohadas",
  climatizacion: "Climatización",
  redes: "Redes y Contraseñas",
  tv: "TV",
  guarda_maletas: "Guarda Maletas",
  hidratacion: "Punto de Hidratación",
  protocolo: "Protocolos",
  emergencia: "Emergencias",
};

export default function HabitacionAdminClient({ initialInfo }: { initialInfo: InfoItem[] }) {
  const [info, setInfo] = useState(initialInfo);

  // Hero image
  const heroRecord = initialInfo.find(i => i.section === "hero_image");
  const [heroImg, setHeroImg] = useState<string>(heroRecord?.content ?? "/images/habitacion.jpg");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [heroSaved, setHeroSaved] = useState(false);
  const heroFileRef = useRef<HTMLInputElement>(null);

  // Nav card images
  const NAV_SECTIONS = [
    { key: "img_housekeeping", label: "Housekeeping", fallback: "/images/habitacion.jpg" },
    { key: "img_informacion",  label: "Información",  fallback: "/images/login-bg.jpg" },
    { key: "img_productos",    label: "Productos",    fallback: "/images/spa.jpg" },
  ] as const;
  type NavKey = typeof NAV_SECTIONS[number]["key"];
  const getNavImg = (key: NavKey) => info.find(i => i.section === key)?.content ?? NAV_SECTIONS.find(s => s.key === key)!.fallback;
  const [uploadingNav, setUploadingNav] = useState<NavKey | null>(null);
  const [savedNav, setSavedNav] = useState<NavKey | null>(null);
  const navFileRefs = {
    img_housekeeping: useRef<HTMLInputElement>(null),
    img_informacion:  useRef<HTMLInputElement>(null),
    img_productos:    useRef<HTMLInputElement>(null),
  };

  // Info section hero images
  const INFO_IMG_SECTIONS = [
    { key: "img_caja",      label: "Caja de Seguridad", fallback: "/images/login-bg.jpg" },
    { key: "img_protocolo", label: "Protocolos",         fallback: "/images/login-bg.jpg" },
    { key: "img_emergencia",label: "Emergencias",        fallback: "/images/login-bg.jpg" },
  ] as const;
  type InfoImgKey = typeof INFO_IMG_SECTIONS[number]["key"];
  const getInfoImg = (key: InfoImgKey) => info.find(i => i.section === key)?.content ?? INFO_IMG_SECTIONS.find(s => s.key === key)!.fallback;
  const [uploadingInfoImg, setUploadingInfoImg] = useState<InfoImgKey | null>(null);
  const [savedInfoImg, setSavedInfoImg] = useState<InfoImgKey | null>(null);
  const infoImgRefs = {
    img_caja:       useRef<HTMLInputElement>(null),
    img_protocolo:  useRef<HTMLInputElement>(null),
    img_emergencia: useRef<HTMLInputElement>(null),
  };

  const handleInfoImgUpload = (key: InfoImgKey) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInfoImg(key);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upJson = await upRes.json();
    if (!upJson.url) { setUploadingInfoImg(null); return; }
    const url = upJson.url;
    const lbl = INFO_IMG_SECTIONS.find(s => s.key === key)!.label;
    const existing = info.find(i => i.section === key);
    if (existing) {
      await fetch("/api/admin/habitacion", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: existing.id, type: "info", section: key, title: lbl, content: url }) });
      setInfo(s => s.map(x => x.id === existing.id ? { ...x, content: url } : x));
    } else {
      const res = await fetch("/api/admin/habitacion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "info", section: key, title: lbl, content: url, order: 0 }) });
      const json = await res.json();
      setInfo(s => [...s, json.info]);
    }
    setUploadingInfoImg(null);
    setSavedInfoImg(key);
    setTimeout(() => setSavedInfoImg(null), 2500);
  };

  const handleNavUpload = (key: NavKey) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingNav(key);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upJson = await upRes.json();
    if (!upJson.url) { setUploadingNav(null); return; }
    const url = upJson.url;
    const label = NAV_SECTIONS.find(s => s.key === key)!.label;
    const existing = info.find(i => i.section === key);
    if (existing) {
      await fetch("/api/admin/habitacion", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: existing.id, type: "info", section: key, title: label, content: url }) });
      setInfo(s => s.map(x => x.id === existing.id ? { ...x, content: url } : x));
    } else {
      const res = await fetch("/api/admin/habitacion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "info", section: key, title: label, content: url, order: 0 }) });
      const json = await res.json();
      setInfo(s => [...s, json.info]);
    }
    setUploadingNav(null);
    setSavedNav(key);
    setTimeout(() => setSavedNav(null), 2500);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    const fd = new FormData();
    fd.append("file", file);
    const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const upJson = await upRes.json();
    if (!upJson.url) { setUploadingHero(false); return; }
    const url = upJson.url;
    if (heroRecord) {
      await fetch("/api/admin/habitacion", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: heroRecord.id, type: "info", section: "hero_image", title: "Hero Imagen", content: url }) });
      setInfo(s => s.map(x => x.id === heroRecord.id ? { ...x, content: url } : x));
    } else {
      const res = await fetch("/api/admin/habitacion", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "info", section: "hero_image", title: "Hero Imagen", content: url, order: 0 }) });
      const json = await res.json();
      setInfo(s => [...s, json.info]);
    }
    setHeroImg(url);
    setUploadingHero(false);
    setHeroSaved(true);
    setTimeout(() => setHeroSaved(false), 2500);
  };
  const [editingInfo, setEditingInfo] = useState<Partial<InfoItem> | null>(null);
  const [query, setQuery] = useState("");



  const saveInfo = async (data: Partial<InfoItem>) => {
    const isNew = !data.id;
    const res = await fetch("/api/admin/habitacion", { method: isNew ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, type: "info" }) });
    const json = await res.json();
    if (isNew) setInfo(s => [...s, json.info]);
    else setInfo(s => s.map(x => x.id === json.info.id ? json.info : x));
    setEditingInfo(null);
  };


  const deleteInfo = async (id: number) => {
    if (!confirm("¿Eliminar?")) return;
    await fetch("/api/admin/habitacion", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, type: "info" }) });
    setInfo(s => s.filter(x => x.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-[22px] font-bold text-gray-900 mb-6">Mi Habitación</h1>

      {/* ── Hero image ── */}
      <div className="mb-5">
        <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imagen Hero</h2>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
          <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
            <Image src={heroImg} alt="Hero" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-[13px] font-medium text-gray-800">Foto principal de Mi Habitación</p>
            {heroSaved
              ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
              : <p className="text-gray-400 text-[11px] mt-0.5">Se muestra como hero en la app del huésped</p>}
          </div>
          <button
            type="button"
            onClick={() => heroFileRef.current?.click()}
            disabled={uploadingHero}
            className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0"
          >
            {uploadingHero ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
            {uploadingHero ? "Subiendo..." : "Cambiar"}
          </button>
          <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} />
        </div>
      </div>

      {/* ── Nav card images ── */}
      <div className="mb-5">
        <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imágenes de Tarjetas</h2>
        <div className="flex flex-col gap-2">
          {NAV_SECTIONS.map(({ key, label }) => (
            <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={getNavImg(key)} alt={label} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-800">{label}</p>
                {savedNav === key
                  ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
                  : <p className="text-gray-400 text-[11px] mt-0.5">Tarjeta en pantalla Mi Habitación</p>}
              </div>
              <button
                type="button"
                onClick={() => navFileRefs[key].current?.click()}
                disabled={uploadingNav === key}
                className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0"
              >
                {uploadingNav === key ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                {uploadingNav === key ? "Subiendo..." : "Cambiar"}
              </button>
              <input ref={navFileRefs[key]} type="file" accept="image/*" className="hidden" onChange={handleNavUpload(key)} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Info section hero images ── */}
      <div className="mb-7">
        <h2 className="font-semibold text-gray-600 text-[13px] uppercase tracking-wide mb-3">Imágenes de Secciones de Información</h2>
        <div className="flex flex-col gap-2">
          {INFO_IMG_SECTIONS.map(({ key, label }) => (
            <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
              <div className="relative w-24 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={getInfoImg(key)} alt={label} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-gray-800">{label}</p>
                {savedInfoImg === key
                  ? <p className="text-green-600 text-[11px] mt-0.5">✓ Imagen actualizada</p>
                  : <p className="text-gray-400 text-[11px] mt-0.5">Hero de la sección en la app del huésped</p>}
              </div>
              <button
                type="button"
                onClick={() => infoImgRefs[key].current?.click()}
                disabled={uploadingInfoImg === key}
                className="flex items-center gap-1.5 bg-[#1B4332] text-white px-3 py-2 rounded-lg text-[12px] font-medium disabled:opacity-60 shrink-0"
              >
                {uploadingInfoImg === key ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
                {uploadingInfoImg === key ? "Subiendo..." : "Cambiar"}
              </button>
              <input ref={infoImgRefs[key]} type="file" accept="image/*" className="hidden" onChange={handleInfoImgUpload(key)} />
            </div>
          ))}
        </div>
      </div>


        <>
          <button onClick={() => setEditingInfo({ section: "caja", active: true })} className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium mb-5">
            <Plus size={15} /> Agregar información
          </button>
          <div className="relative mb-5">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar información..." className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white" />
          </div>
          {info.filter(i => !i.section.startsWith("img_") && !i.section.startsWith("act_cat_") && i.section !== "hero_image" && (!query || i.title.toLowerCase().includes(query.toLowerCase()) || i.section.toLowerCase().includes(query.toLowerCase()))).map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-3 flex justify-between gap-3">
              <div className="flex-1">
                <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-[#1B4332] bg-[#1B4332]/10 rounded px-1.5 py-0.5 mb-1">{SECTION_LABELS[item.section] ?? item.section}</span>
                <p className="font-semibold text-gray-900 text-[14px]">{item.title}</p>
                <p className="text-gray-400 text-[12px] mt-0.5 line-clamp-3 whitespace-pre-line">{item.content}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditingInfo(item)} className="p-1.5 text-gray-400 hover:text-gray-700"><Pencil size={13} /></button>
                <button onClick={() => deleteInfo(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </>


      {/* Info modal */}
      {editingInfo && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between mb-4"><h3 className="font-bold text-gray-900">Información</h3><button onClick={() => setEditingInfo(null)}><X size={18} className="text-gray-400" /></button></div>
            <div className="flex flex-col gap-3">
              <div><label className="text-[12px] font-semibold text-gray-600 mb-1 block">Sección</label>
                <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]" value={editingInfo.section ?? "caja_seguridad"} onChange={e => setEditingInfo(p => ({ ...p!, section: e.target.value }))}>
                  <option value="housekeeping">Servicios de Aseo</option>
                  <option value="lavanderia">Lavandería</option>
                  <option value="caja">Caja de Seguridad</option>
                  <option value="minibar">Minibar</option>
                  <option value="room_service">Room Service</option>
                  <option value="almohadas">Menú de Almohadas</option>
                  <option value="climatizacion">Climatización</option>
                  <option value="redes">Redes y Contraseñas</option>
                  <option value="tv">TV</option>
                  <option value="guarda_maletas">Guarda Maletas</option>
                  <option value="hidratacion">Punto de Hidratación</option>
                  <option value="protocolo">Protocolos</option>
                  <option value="emergencia">Emergencias</option>
                </select>
              </div>
              {[{ key: "title", label: "Título" }, { key: "content", label: "Contenido", multi: true }].map(f => (
                <div key={f.key}><label className="text-[12px] font-semibold text-gray-600 mb-1 block">{f.label}</label>
                  {f.multi ? <textarea rows={5} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px] resize-none" value={(editingInfo as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setEditingInfo(p => ({ ...p!, [f.key]: e.target.value }))} />
                  : <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]" value={(editingInfo as Record<string, string | null | undefined | boolean>)[f.key] as string ?? ""} onChange={e => setEditingInfo(p => ({ ...p!, [f.key]: e.target.value }))} />}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditingInfo(null)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-[14px] text-gray-600">Cancelar</button>
              <button onClick={() => saveInfo(editingInfo)} className="flex-1 bg-[#1B4332] text-white rounded-xl py-2.5 text-[14px] font-medium flex items-center justify-center gap-2"><Save size={14} /> Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
