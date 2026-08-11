"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { useUiTexts } from "@/components/useUiTexts";

interface SpaService { id: number; category: string; name: string; description: string | null; duration: string | null; price: string | null; }
interface Schedule { venue: string; hours: string; }

const CATEGORY_ORDER = ["Masajes y Terapias", "Masajes y terapias", "Rituales de Renovación", "Rituales de Renovación Corporal", "Faciales y Jacuzzi", "Tratamientos Faciales y Jacuzzi", "Peluquería y Manicure", "Circuitos de Agua"];

export default function SpaTratamientosPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");
  const [services, setServices] = useState<SpaService[]>([]);
  const uiText = useUiTexts("ui-tratamientos");
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

      {/* Barra Superior Wellness — bajo el header, sobre el hero (Figma) */}
      <div className="bg-[#215732] sticky top-[85px] md:top-[68px] z-40" style={{ minHeight: 56, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3 md:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[15px] transition-all whitespace-nowrap ${activeCategory === cat ? "bg-[#0E371B] text-[#FFFBF3] font-medium" : "text-white/80 hover:text-white font-normal"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <HeroImage src={heroImg} alt="Menú de Tratamientos" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05, maxWidth: 340 }}>{uiText("Título", "Menú de Tratamientos")}</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton />
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
        {/* Título sección */}
        <h2 className="font-playfair text-[#3D2B1F] text-[24px] font-bold text-center mt-1">{activeCategory}</h2>

        {/* Servicios */}
        {filtered.length > 0 ? filtered.map(service => (
          <TreatmentCard key={service.id} service={service} />
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
              <span className="font-playfair font-bold text-[#3D2B1F] text-[18px]">{uiText("Título reglamento", "Reglamento de Seguridad e Higiene")}</span>
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

// Card de tratamiento (Figma: instancia "Masaje Barro" 382×137 — bg #F3ECE4 r12,
// título Poltawski Bold 20, desc Cooper Hewitt 16, filete #D7D2CB, chevron #D7D2CB,
// fila inferior: $ dorado + precio 15 café (izq) | reloj dorado + duración 15 café (der))
function TreatmentCard({ service }: { service: SpaService }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="shadow-sm" style={{ backgroundColor: "#F3ECE4", borderRadius: 12, padding: "10px 16px 12px" }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex justify-between items-center gap-3">
        <span className="text-left" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, color: "#54432B" }}>
          {service.name}
        </span>
        <i className={`${open ? "fi-rs-angle-up" : "fi-rs-angle-down"} shrink-0`} style={{ fontSize: 13, color: "#D7D2CB" }} />
      </button>
      {open && (
        <>
          {service.description && (
            <p className="mt-1" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, lineHeight: 1.3, color: "#54432B" }}>
              {service.description}
            </p>
          )}
          {(service.price || service.duration) && (
            <>
              <div className="mt-2.5" style={{ borderTop: "1px solid #D7D2CB" }} />
              <div className="flex items-center mt-2">
                {service.price && (
                  <div className="flex items-center gap-1.5 flex-1">
                    <i className="fi-ts-usd-circle" style={{ fontSize: 14, color: "#DBA33B", lineHeight: 1 }} />
                    <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{service.price}</span>
                  </div>
                )}
                {service.duration && (
                  <div className="flex items-center gap-1.5">
                    <i className="fi-ts-clock-three" style={{ fontSize: 14, color: "#DBA33B", lineHeight: 1 }} />
                    <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{service.duration}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
