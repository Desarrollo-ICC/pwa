"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { useUiTexts } from "@/components/useUiTexts";
import { ChevronRight } from "lucide-react";
import { RESTAURANTS, slugifyCat } from "../config";

interface Item { id: number; category: string; subcategory: string | null; name: string; description: string | null; price: string | null; }
interface Schedule { id: number; info: string; }

export default function RestaurantPage({ params }: { params: Promise<{ restaurant: string }> }) {
  const { restaurant } = use(params);
  const router = useRouter();
  const cfg = RESTAURANTS[restaurant];
  const [items, setItems] = useState<Item[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const uiText = useUiTexts("ui-restaurantes");

  useEffect(() => {
    if (!cfg) return;
    fetch(`/api/restaurantes/${cfg.apiKey}`).then(r => r.json()).then(d => setItems(d.items ?? []));
    fetch(`/api/restaurantes/schedules?restaurant=${cfg.apiKey}`).then(r => r.json()).then(d => setSchedules(d.schedules ?? []));
  }, [cfg]);

  if (!cfg) return null;

  const daily = items.filter(i => i.category === "Menú del día");
  const menuCats = Array.from(new Set(items.filter(i => i.category !== "Menú del día").map(i => i.category)));

  return (
    <div className="min-h-svh bg-[#FFFBF3]">

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <HeroImage src={cfg.image} alt={cfg.label} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1 }}>{cfg.label}</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton />
        </div>
      </div>

      <div className="px-5 py-6 pb-24 md:pb-12 md:max-w-3xl md:mx-auto">
        {/* Horarios de Atención */}
        {schedules.length > 0 && (
          <div className="mb-6">
            <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-2">
              {uiText("Título horarios", "Horarios de Atención:")}
            </h2>
            {schedules.map(s => {
              const isHeading = /^(Desayuno|Almuerzo|Cena|Once):?$/i.test(s.info.trim());
              return isHeading ? (
                <p key={s.id} className="text-[14px] text-[#3D2B1F] font-bold mt-2">{s.info}</p>
              ) : (
                <p key={s.id} className="text-[14px] text-[#3D2B1F] leading-relaxed">{s.info}</p>
              );
            })}
          </div>
        )}

        {/* Menú del día */}
        {daily.length > 0 && (
          <div className="mb-7">
            {/* Filete sobre Menú del día (Figma) */}
            {schedules.length > 0 && <div style={{ borderTop: "2px solid #D7D2CB", marginTop: 40, marginBottom: 46 }} />}
            <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, color: "#54432B", textAlign: "center" }} className="mb-3">
              {uiText("Título menú del día", "Menú del día")}
            </h2>
            <div className="flex overflow-x-auto no-scrollbar gap-4 pb-2" style={{ scrollSnapType: "x mandatory" }}>
              {daily.map(d => (
                <div key={d.id} className="shrink-0 w-[82vw] max-w-[320px] bg-[#F3ECE4] rounded-2xl overflow-hidden border border-[#EDE6D8] shadow-sm snap-center">
                  <img src={cfg.image} alt={d.name} className="w-full h-[170px] object-cover" />
                  <div className="p-4">
                    <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }} className="mb-1">{d.name}</h3>
                    {d.description && <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-2">{d.description}</p>}
                    {d.price && <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#DBA33B" }}>{d.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Carta única → se muestra en la misma página (Figma: Muffin Café) */}
        {menuCats.length === 1 && (
          <>
            {(daily.length > 0 || schedules.length > 0) && <div style={{ borderTop: "2px solid #D7D2CB", marginTop: 40, marginBottom: 46 }} />}
            <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, color: "#54432B", textAlign: "center" }} className="mb-3">
              {uiText(`Título carta — ${restaurant}`, cfg.menuHeading)}
            </h2>
            <div className="flex flex-col gap-5">
              {Object.entries(
                items.filter(i => i.category !== "Menú del día").reduce<Record<string, Item[]>>((acc, item) => {
                  (acc[item.subcategory ?? "General"] ??= []).push(item);
                  return acc;
                }, {})
              ).map(([sub, subItems]) => (
                /* Figma (Muffin Café): el título de la subcategoría va DENTRO de la card, a la izquierda */
                <div key={sub} className="bg-[#F3ECE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 pt-3.5 pb-2 flex flex-col">
                  <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-1">{sub}</h3>
                  <div className="flex flex-col divide-y divide-[#E8DDD0]">
                    {subItems.map(item => (
                      <div key={item.id} className="flex justify-between items-start gap-3 py-2.5">
                        <div className="flex-1">
                          <p style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 15, color: "#54432B" }}>{item.name}</p>
                          {item.description && <p className="text-[#9B9280] text-[12px] mt-0.5">{item.description}</p>}
                        </div>
                        {item.price && <span className="shrink-0" style={{ fontFamily: "Cooper Hewitt, sans-serif", fontWeight: 400, fontSize: 15, lineHeight: 1.5, color: "#DBA33B" }}>{item.price}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Varias cartas → accesos (Figma: Arboleda, La Grieta) */}
        {menuCats.length > 1 && (
          <>
            {(daily.length > 0 || schedules.length > 0) && <div style={{ borderTop: "2px solid #D7D2CB", marginTop: 40, marginBottom: 46 }} />}
            <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, color: "#54432B", textAlign: "center" }} className="mb-3">
              {uiText(`Título carta — ${restaurant}`, cfg.menuHeading)}
            </h2>
            <div className="flex flex-col gap-3">
              {menuCats.map(cat => (
                <Link
                  key={cat}
                  href={`/restaurantes/${restaurant}/${slugifyCat(cat)}`}
                  className="flex justify-between items-center px-4 py-4 rounded-2xl bg-[#F3ECE4] border border-[#EDE6D8] shadow-sm active:opacity-80"
                >
                  <span style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }}>{cat}</span>
                  <ChevronRight size={18} className="text-[#9B9280] shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}

        {items.length === 0 && <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando menú...</p>}
      </div>

      <BottomNav />
    </div>
  );
}
