"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import { RESTAURANTS, slugifyCat } from "../../config";

interface Item { id: number; category: string; subcategory: string | null; name: string; description: string | null; price: string | null; }

export default function RestaurantCategoryPage({ params }: { params: Promise<{ restaurant: string; categoria: string }> }) {
  const { restaurant, categoria } = use(params);
  const router = useRouter();
  const cfg = RESTAURANTS[restaurant];
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSub, setActiveSub] = useState<string | null>(null);

  useEffect(() => {
    if (!cfg) return;
    fetch(`/api/restaurantes/${cfg.apiKey}`)
      .then(r => r.json())
      .then(d => { setItems(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [cfg]);

  if (!cfg) return null;

  const catItems = items.filter(i => slugifyCat(i.category) === categoria);
  const categoryName = catItems[0]?.category ?? "";

  const bySub = catItems.reduce<Record<string, Item[]>>((acc, item) => {
    const key = item.subcategory ?? "General";
    (acc[key] ??= []).push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />

      {/* Barra Superior de subcategorías — bajo el header, sobre el hero.
          Figma: solo en cartas tipo card (Coctelería, Comida); Vinos/Destilados/Otras Bebidas no la llevan. */}
      {Object.keys(bySub).length > 1 && catItems.some(i => i.description) && (
        <div className="bg-[#215732] sticky top-[85px] z-40" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3 md:justify-center">
            {Object.keys(bySub).map(sub => (
              <button
                key={sub}
                onClick={() => { setActiveSub(sub); document.getElementById(`sub-${slugifyCat(sub)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[15px] whitespace-nowrap transition-all ${activeSub === sub ? "bg-[#0E371B] text-[#FFFBF3] font-medium" : "text-white/85 hover:text-white font-normal"}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <img src={cfg.image} alt={categoryName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05, maxWidth: 340 }}>
            {categoryName || " "}
          </h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton />
        </div>
      </div>

      <div className="px-4 py-6 pb-24 md:pb-12 flex flex-col gap-5 md:max-w-3xl md:mx-auto">
        {loading && <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando…</p>}
        {!loading && catItems.length === 0 && (
          <p className="text-[#9B9280] text-center py-8 text-[14px]">Sin ítems en esta carta.</p>
        )}
        {Object.entries(bySub).map(([sub, subItems]) => {
          // Figma: ítems con descripción (coctelería, licores, comida) → cards desplegables;
          // listas simples (vinos, destilados) → filas nombre/precio dorado
          const cardStyle = subItems.some(i => i.description);
          return (
            <div key={sub} id={`sub-${slugifyCat(sub)}`} style={{ scrollMarginTop: 150 }}>
              {cardStyle ? (
                <>
                  <h3 className="font-playfair font-bold text-[#54432B] text-[26px] leading-none text-center mb-3">{sub}</h3>
                  <div className="flex flex-col" style={{ gap: 20 }}>
                    {subItems.map(item => <DrinkCard key={item.id} item={item} />)}
                  </div>
                </>
              ) : (
                /* Figma: el título (Pisco, Whisky…) va DENTRO de la card, alineado a la izquierda */
                <div className="bg-[#F3ECE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 pt-3.5 pb-2 flex flex-col">
                  <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-1">{sub}</h3>
                  <div className="flex flex-col divide-y divide-[#E8DDD0]">
                    {subItems.map(item => (
                      <div key={item.id} className="flex justify-between items-start gap-3 py-2.5">
                        <p className="flex-1" style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 15, color: "#54432B" }}>{item.name}</p>
                        {item.price && (
                          <span className="shrink-0" style={{ fontFamily: "Cooper Hewitt, sans-serif", fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: "#DBA33B" }}>{item.price}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}

// Card de trago/plato (Figma: instancia "Margarita" 382×116 — bg #F3ECE4 r12,
// título Poltawski Bold 20, descripción Cooper Hewitt 16, filete #D7D2CB,
// precio 15 con ícono usd-circle dorado, chevron desplegable)
function DrinkCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="shadow-sm" style={{ backgroundColor: "#F3ECE4", borderRadius: 12, padding: "10px 16px 12px" }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex justify-between items-center gap-3">
        <span className="text-left" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, color: "#54432B" }}>
          {item.name}
        </span>
        <i className={`${open ? "fi-rs-angle-up" : "fi-rs-angle-down"} shrink-0`} style={{ fontSize: 13, color: "#54432B" }} />
      </button>
      {open && (
        <>
          {item.description && (
            <p className="mt-1" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, lineHeight: 1.3, color: "#54432B" }}>
              {item.description}
            </p>
          )}
          {item.price && (
            <>
              <div className="mt-2.5" style={{ borderTop: "1px solid #D7D2CB" }} />
              <div className="flex items-center gap-1.5 mt-2">
                <i className="fi-ts-usd-circle" style={{ fontSize: 14, color: "#DBA33B", lineHeight: 1 }} />
                <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{item.price}</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
