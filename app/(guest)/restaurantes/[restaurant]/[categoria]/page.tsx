"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
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

      {/* Barra Superior de subcategorías — bajo el header, sobre el hero (Figma) */}
      {Object.keys(bySub).length > 1 && (
        <div className="bg-[#1B4332] sticky top-[85px] z-40" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3 md:justify-center">
            {Object.keys(bySub).map(sub => (
              <button
                key={sub}
                onClick={() => { setActiveSub(sub); document.getElementById(`sub-${slugifyCat(sub)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all ${activeSub === sub ? "bg-[#215732] text-[#FFFBF3]" : "text-white/85 hover:text-white"}`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <img src={cfg.image} alt={categoryName} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05 }}>
            {categoryName || " "}
          </h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[15px] font-medium px-6 py-1 rounded-full active:opacity-80"><i className="fi-rs-angle-left" style={{ fontSize: 11, marginRight: 6 }} />Volver</button>
        </div>
      </div>

      <div className="px-4 py-6 pb-24 md:pb-12 flex flex-col gap-5 md:max-w-3xl md:mx-auto">
        {loading && <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando…</p>}
        {!loading && catItems.length === 0 && (
          <p className="text-[#9B9280] text-center py-8 text-[14px]">Sin ítems en esta carta.</p>
        )}
        {Object.entries(bySub).map(([sub, subItems]) => (
          <div key={sub} id={`sub-${slugifyCat(sub)}`} style={{ scrollMarginTop: 150 }}>
            <h3 className="font-playfair font-bold text-[#54432B] text-[26px] leading-none text-center mb-3">{sub}</h3>
            <div className="bg-[#F3EDE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 py-2 flex flex-col divide-y divide-[#E8DDD0]">
              {subItems.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-3 py-2.5">
                  <div className="flex-1">
                    <p style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 14, color: "#54432B" }}>{item.name}</p>
                    {item.description && <p className="text-[#9B9280] text-[12px] mt-0.5">{item.description}</p>}
                  </div>
                  {item.price && (
                    <span className="shrink-0" style={{ fontFamily: "Cooper Hewitt, sans-serif", fontWeight: 400, fontSize: 14, lineHeight: 1.5, color: "#DBA33B" }}>{item.price}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
