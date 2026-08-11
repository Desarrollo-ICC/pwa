"use client";
import { useMemo, useState } from "react";
import { Pencil, Trash2, Plus, X, Save, Search, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface Block {
  id: number; page: string; pageTitle: string; block: string;
  title: string | null; content: string | null; image: string | null;
  active: boolean; order: number;
}

const BLOCK_TYPES = [
  { value: "text",  label: "Texto (título + contenido)" },
  { value: "section", label: "Sección (título grande centrado + contenido)" },
  { value: "intro", label: "Introducción (párrafo suelto)" },
  { value: "list",  label: "Lista (una línea por ítem)" },
  { value: "price", label: "Precios (Nombre — $valor por línea)" },
  { value: "link",  label: "Enlace (contenido = ruta destino)" },
  { value: "button", label: "Botón verde (título = texto, contenido = URL externa)" },
  { value: "divider", label: "Filete divisor (línea horizontal)" },
  { value: "note",  label: "Nota al pie" },
];

export default function InfoPagesAdminClient({ initialBlocks }: { initialBlocks: Block[] }) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Partial<Block> | null>(null);
  const [saving, setSaving] = useState(false);
  const [openPage, setOpenPage] = useState<string | null>(null);

  const pages = useMemo(() => {
    const m: Record<string, { title: string; items: Block[] }> = {};
    for (const b of blocks) {
      m[b.page] ??= { title: b.pageTitle, items: [] };
      m[b.page].items.push(b);
    }
    for (const k of Object.keys(m)) m[k].items.sort((a, b) => a.order - b.order);
    return m;
  }, [blocks]);

  const pageKeys = Object.keys(pages)
    .filter(p => !query || p.includes(query.toLowerCase()) || pages[p].title.toLowerCase().includes(query.toLowerCase()))
    .sort();

  async function save() {
    if (!editing) return;
    setSaving(true);
    const isNew = !editing.id;
    const res = await fetch("/api/admin/info-pages", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    setSaving(false);
    if (!res.ok) { alert("Error al guardar"); return; }
    const { block } = await res.json();
    setBlocks(prev => isNew ? [...prev, block] : prev.map(b => b.id === block.id ? block : b));
    setEditing(null);
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar este bloque?")) return;
    const res = await fetch(`/api/admin/info-pages?id=${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Error al eliminar"); return; }
    setBlocks(prev => prev.filter(b => b.id !== id));
  }

  return (
    <div className="p-5 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[22px] font-bold text-gray-900">Páginas de Información</h1>
      </div>
      <p className="text-gray-500 text-[13px] mb-5">
        Contenido de las pantallas informativas (Circuitos, Programa del Viajero, Tiendas, Reglamento, etc.).
      </p>

      <div className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar página..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-[14px] outline-none focus:border-[#1B4332] bg-white"
          />
        </div>
        <button
          onClick={() => setEditing({ page: "", pageTitle: "", block: "text", active: true, order: 0 })}
          className="flex items-center gap-2 bg-[#1B4332] text-white px-4 py-2 rounded-xl text-[13px] font-medium shrink-0"
        >
          <Plus size={15} /> Nuevo bloque
        </button>
      </div>

      {pageKeys.map(pageKey => {
        const { title, items } = pages[pageKey];
        const open = openPage === pageKey;
        return (
          <div key={pageKey} className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-3 overflow-hidden">
            <button onClick={() => setOpenPage(open ? null : pageKey)} className="w-full flex justify-between items-center px-4 py-3.5">
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-[15px]">{title}</p>
                <p className="text-gray-400 text-[12px]">/info/{pageKey} · {items.length} bloques</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a href={`/info/${pageKey}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-gray-400 hover:text-[#1B4332]">
                  <ExternalLink size={15} />
                </a>
                {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </button>

            {open && (
              <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-2">
                {items.map(b => (
                  <div key={b.id} className="flex justify-between items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wide text-[#1B4332] bg-[#1B4332]/10 rounded px-1.5 py-0.5 mb-1">{b.block}</span>
                      {b.title && <p className="font-medium text-gray-900 text-[13px]">{b.title}</p>}
                      <p className="text-gray-400 text-[12px] line-clamp-2 whitespace-pre-line">{b.content}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => setEditing(b)} className="p-1.5 text-gray-400 hover:text-gray-700"><Pencil size={13} /></button>
                      <button onClick={() => remove(b.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setEditing({ page: pageKey, pageTitle: title, block: "text", active: true, order: (items.at(-1)?.order ?? 0) + 1 })}
                  className="flex items-center justify-center gap-1.5 text-[#1B4332] text-[13px] font-medium py-2 rounded-xl border border-dashed border-gray-200 hover:bg-gray-50"
                >
                  <Plus size={14} /> Agregar bloque a esta página
                </button>
              </div>
            )}
          </div>
        );
      })}

      {pageKeys.length === 0 && (
        <p className="text-gray-400 text-center py-10 text-[14px]">No hay páginas que coincidan.</p>
      )}

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-gray-900 text-[16px]">{editing.id ? "Editar bloque" : "Nuevo bloque"}</h2>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">Página (slug)</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]"
                    value={editing.page ?? ""}
                    onChange={e => setEditing(p => ({ ...p!, page: e.target.value }))}
                    placeholder="programa-viajero"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">Título de la página</label>
                  <input
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]"
                    value={editing.pageTitle ?? ""}
                    onChange={e => setEditing(p => ({ ...p!, pageTitle: e.target.value }))}
                    placeholder="Programa del Viajero"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] text-gray-500 mb-1 block">Tipo de bloque</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]"
                  value={editing.block ?? "text"}
                  onChange={e => setEditing(p => ({ ...p!, block: e.target.value }))}
                >
                  {BLOCK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[12px] text-gray-500 mb-1 block">Título del bloque</label>
                <input
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]"
                  value={editing.title ?? ""}
                  onChange={e => setEditing(p => ({ ...p!, title: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-[12px] text-gray-500 mb-1 block">Contenido</label>
                <textarea
                  rows={8}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px] font-mono"
                  value={editing.content ?? ""}
                  onChange={e => setEditing(p => ({ ...p!, content: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] text-gray-500 mb-1 block">Orden</label>
                  <input
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[14px]"
                    value={editing.order ?? 0}
                    onChange={e => setEditing(p => ({ ...p!, order: Number(e.target.value) }))}
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-[14px] text-gray-700">
                    <input
                      type="checkbox"
                      checked={editing.active ?? true}
                      onChange={e => setEditing(p => ({ ...p!, active: e.target.checked }))}
                    />
                    Visible
                  </label>
                </div>
              </div>

              <button
                onClick={save}
                disabled={saving || !editing.page || !editing.pageTitle}
                className="flex items-center justify-center gap-2 bg-[#1B4332] text-white py-2.5 rounded-xl text-[14px] font-medium disabled:opacity-50 mt-1"
              >
                <Save size={15} /> {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
