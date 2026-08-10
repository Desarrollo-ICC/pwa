"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { useUiTexts } from "@/components/useUiTexts";

interface Activity { id: number; season: string; category: string; name: string; price: string | null; }

// Ski Rental — sección propia (feedback DSÑ 06-08, Figma: PWA- Ski Rental).
// Los precios viven en `activities` (categorías SKI –) y se editan desde el admin de Actividades.
const GROUPS: { cat: string; title: string }[] = [
  { cat: "SKI – Renta por Día", title: "Renta por Día" },
  { cat: "SKI – Renta Semanal", title: "Renta por Semana" },
  { cat: "SKI – Servicios", title: "Servicios" },
];

const INTRO =
  "Para que disfrute al máximo su experiencia en la montaña, ponemos a su disposición nuestro servicio de Ski Rental, desde las 8:30 hasta las 18:00 hrs.\n\nReserve su equipo con anticipación, idealmente el día previo a su uso, para asegurar tallas, modelos y accesorios requeridos.";

export default function SkiRentalPage() {
  const router = useRouter();
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const uiText = useUiTexts("ui-ski-rental");

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
      <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <HeroImage src="/images/fig-hero-ski-rental.jpg" alt="Ski Rental" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05 }}>{uiText("Título", "Ski Rental")}</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton />
        </div>
      </div>

      <div className="px-5 py-7 pb-24 md:pb-12 md:max-w-3xl md:mx-auto flex flex-col gap-6">
        {loading && <p className="text-[#9B9280] text-center py-10 text-[14px]">Cargando…</p>}
        {!loading && (
          <>
            {/* Intro (Figma) */}
            <p className="whitespace-pre-line" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, lineHeight: 1.4, color: "#54432B" }}>
              {uiText("Intro", INTRO)}
            </p>
            {/* Filete + advertencia del dólar (Figma) */}
            <div style={{ borderTop: "2px solid #D7D2CB" }} />
            <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 700, fontSize: 16, color: "#C66E4E" }}>
              {uiText("Advertencia", "Estos precios pueden variar según el valor del dólar")}
            </p>
          </>
        )}
        {GROUPS.map(g => {
          const rows = items.filter(i => i.category === g.cat);
          if (!rows.length) return null;
          return (
            /* Figma: el título va DENTRO de la card, precios dorados */
            <div key={g.cat} className="bg-[#F3ECE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 pt-3.5 pb-2 flex flex-col">
              <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-1">
                {uiText(`Título — ${g.cat}`, g.title)}
              </h2>
              <div className="flex flex-col divide-y divide-[#E8DDD0]">
                {rows.map(r => (
                  <div key={r.id} className="flex justify-between items-center gap-3 py-2.5">
                    <span style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 15, color: "#54432B" }}>{r.name}</span>
                    {r.price && <span className="shrink-0" style={{ fontFamily: "Cooper Hewitt, sans-serif", fontSize: 15, color: "#DBA33B" }}>{r.price}</span>}
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
