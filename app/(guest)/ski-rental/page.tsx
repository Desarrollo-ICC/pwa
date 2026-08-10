"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface Activity { id: number; season: string; category: string; name: string; price: string | null; }

// Ski Rental — sección propia (feedback DSÑ 06-08, Figma: PWA- Ski Rental).
// Los precios viven en `activities` (categorías SKI –) y se editan desde el admin de Actividades.
const GROUPS: { cat: string; title: string }[] = [
  { cat: "SKI – Renta por Día", title: "Renta por Día" },
  { cat: "SKI – Renta Semanal", title: "Renta Semanal" },
  { cat: "SKI – Servicios", title: "Servicios" },
];

export default function SkiRentalPage() {
  const router = useRouter();
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/actividades")
      .then(r => r.json())
      .then(d => { setItems((d.activities ?? []).filter((a: Activity) => a.category.startsWith("SKI –"))); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <img src="/images/fig-hero-ski-rental.jpg" alt="Ski Rental" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05 }}>Ski Rental</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[15px] font-medium px-6 py-1 rounded-full active:opacity-80">
            <i className="fi-rs-angle-left" style={{ fontSize: 11, marginRight: 6 }} />Volver
          </button>
        </div>
      </div>

      <div className="px-5 py-7 pb-24 md:pb-12 md:max-w-3xl md:mx-auto flex flex-col gap-6">
        {loading && <p className="text-[#9B9280] text-center py-10 text-[14px]">Cargando…</p>}
        {GROUPS.map(g => {
          const rows = items.filter(i => i.category === g.cat);
          if (!rows.length) return null;
          return (
            <div key={g.cat}>
              <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-2">
                {g.title}
              </h2>
              <div className="bg-[#F3EDE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 py-2 flex flex-col divide-y divide-[#E8DDD0]">
                {rows.map(r => (
                  <div key={r.id} className="flex justify-between items-center gap-3 py-2.5">
                    <span style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 14, color: "#54432B" }}>{r.name}</span>
                    {r.price && <span className="shrink-0 font-bold" style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 14, color: "#54432B" }}>{r.price}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
