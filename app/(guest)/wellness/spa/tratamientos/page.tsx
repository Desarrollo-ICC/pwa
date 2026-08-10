"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface SpaService { id: number; category: string; name: string; description: string | null; duration: string | null; price: string | null; }
interface Schedule { venue: string; hours: string; }

const CATEGORY_ORDER = ["Masajes y Terapias", "Masajes y terapias", "Rituales de Renovación", "Rituales de Renovación Corporal", "Faciales y Jacuzzi", "Tratamientos Faciales y Jacuzzi", "Peluquería y Manicure", "Circuitos de Agua"];

export default function SpaTratamientosPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");
  const [services, setServices] = useState<SpaService[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [heroImg, setHeroImg] = useState<string | null>(null);
  const [reglamento, setReglamento] = useState("");
  const [reglamentoOpen, setReglamentoOpen] = useState(false);

  const categories = Array.from(new Set(services.map(s => s.category)))
    .sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) setActiveCategory(categories[0]);
  }, [categories.join()]);

  useEffect(() => {
    fetch("/api/spa/services").then(r => r.json()).then(d => setServices(d.services ?? []));
    fetch("/api/spa/reglamento").then(r => r.json()).then(d => setReglamento(d.reglamento ?? ""));
    fetch("/api/spa/schedules").then(r => r.json()).then(d => setSchedules(d.schedules ?? []));
    fetch("/api/familia").then(r => r.json()).then(d => {
      const hero = (d.programs ?? []).find((p: { type: string; image: string | null }) => p.type === "hero_spa");
      setHeroImg(hero?.image ?? "/images/spa.jpg");
    }).catch(() => setHeroImg("/images/spa.jpg"));
  }, []);

  const filtered = services.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />

      {/* Barra Superior Wellness — bajo el header, sobre el hero (Figma) */}
      <div className="bg-[#1B4332] sticky top-[85px] z-40" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3 md:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[15px] transition-all whitespace-nowrap ${activeCategory === cat ? "bg-[#215732] text-[#FFFBF3] font-medium" : "text-white/80 hover:text-white font-normal"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: heroImg ? `url('${heroImg}')` : undefined }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Menú de Tratamientos</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[15px] font-medium px-6 py-1 rounded-full active:opacity-80"><i className="fi-rs-angle-left" style={{ fontSize: 11, marginRight: 6 }} />Volver</button>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
        {/* Título sección */}
        <h2 className="font-playfair text-[#3D2B1F] text-[24px] font-bold text-center mt-1">{activeCategory}</h2>

        {/* Servicios */}
        {filtered.length > 0 ? filtered.map(service => (
          <div key={service.id} className="bg-[#F3ECE4] rounded-2xl p-4 border border-[#EDE6D8] shadow-sm">
            <h3 className="font-bold text-[#3D2B1F] text-[15px] mb-1">{service.name}</h3>
            {service.description && (
              <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-3">{service.description}</p>
            )}
            <div className="flex items-center gap-4">
              {service.price && (
                <div className="flex items-center gap-1.5 text-[#C8963E]">
                  <i className="fi-rs-usd-circle" style={{ fontSize: 14 }} />
                  <span className="text-[13px] font-semibold">{service.price}</span>
                </div>
              )}
              {service.duration && (
                <div className="flex items-center gap-1.5 text-[#7B6354]">
                  <i className="fi-rs-clock-three" style={{ fontSize: 14 }} />
                  <span className="text-[13px]">{service.duration}</span>
                </div>
              )}
            </div>
          </div>
        )) : (
          <p className="text-[#9B9280] text-center py-8 text-[14px]">Cargando servicios...</p>
        )}

        {/* Reglamento */}
        {reglamento && (
          <div className="mt-4 bg-[#F3ECE4] rounded-2xl border border-[#EDE6D8] overflow-hidden">
            <button
              onClick={() => setReglamentoOpen(o => !o)}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <span className="font-playfair font-bold text-[#3D2B1F] text-[18px]">Reglamento de Seguridad e Higiene</span>
              <i className={`fi-rs-angle-${reglamentoOpen ? "up" : "down"} text-[#3D2B1F]`} style={{ fontSize: 14 }} />
            </button>
            {reglamentoOpen && (
              <div className="px-4 pb-4 border-t border-[#EDE6D8]">
                {reglamento.split("\n").map((line, i) => (
                  line.trim() ? (
                    <p key={i} className="text-[#3D2B1F] text-[13px] leading-relaxed mt-2">{line}</p>
                  ) : <div key={i} className="mt-1" />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
