"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { useUiTexts } from "@/components/useUiTexts";

interface GymClass { id: number; name: string; description: string | null; price: string | null; schedule: string | null; }

export default function GimnasioPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const uiText = useUiTexts("ui-gimnasio");
  const [heroImg, setHeroImg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gym/classes").then(r => r.json()).then(d => setClasses(d.classes ?? []));
    fetch("/api/familia").then(r => r.json()).then(d => {
      const hero = (d.programs ?? []).find((p: { type: string; image: string | null }) => p.type === "hero_gimnasio");
      setHeroImg(hero?.image ?? "/images/gimnasio.jpg");
    }).catch(() => setHeroImg("/images/gimnasio.jpg"));
  }, []);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <div>
        <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <HeroImage src={heroImg} alt="Gimnasio" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>{uiText("Título", "Gimnasio")}</h1>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <VolverButton />
          </div>
        </div>

        <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
          {/* Horarios — texto plano, sin card (Figma) */}
          <div>
            <p style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: "#54432B" }} className="mb-2">{uiText("Título horarios", "Horarios de Atención:")}</p>
            <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, color: "#54432B" }}>{uiText("Horarios", "Horario Continuo.")}</p>
          </div>

          {/* Filete + título de sección (Figma) */}
          <div style={{ borderTop: "2px solid #D7D2CB", marginTop: 20, marginBottom: 26 }} />
          <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1, color: "#54432B", textAlign: "center" }}>{uiText("Título sección", "Fitness y Clases")}</h2>
          {classes.length > 0 ? (
            classes.map(c => <GymCard key={c.id} c={c} />)
          ) : (
            <p className="text-[#9B9280] text-center py-6 text-[14px]">Cargando clases...</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

// Card de clase (Figma: instancia "Precio 2 Líneas" 382×137 — igual a tratamientos:
// título Poltawski Bold 20, desc 16, filete, $ dorado + precio café | reloj dorado + horario café; desplegable)
function GymCard({ c }: { c: GymClass }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="shadow-sm" style={{ backgroundColor: "#F3ECE4", borderRadius: 12, padding: "10px 16px 12px" }}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex justify-between items-center gap-3">
        <span className="text-left" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, color: "#54432B" }}>
          {c.name}
        </span>
        <i className={`${open ? "fi-rs-angle-up" : "fi-rs-angle-down"} shrink-0`} style={{ fontSize: 13, color: "#D7D2CB" }} />
      </button>
      {open && (
        <>
          {c.description && (
            <p className="mt-1" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, lineHeight: 1.3, color: "#54432B" }}>
              {c.description}
            </p>
          )}
          {(c.price || c.schedule) && (
            <>
              <div className="mt-2.5" style={{ borderTop: "1px solid #D7D2CB" }} />
              <div className="flex items-center mt-2">
                {c.price && (
                  <div className="flex items-center gap-1.5 flex-1">
                    <i className="fi-ts-usd-circle" style={{ fontSize: 14, color: "#DBA33B", lineHeight: 1 }} />
                    <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{c.price}</span>
                  </div>
                )}
                {c.schedule && (
                  <div className="flex items-center gap-1.5">
                    <i className="fi-ts-clock-three" style={{ fontSize: 14, color: "#DBA33B", lineHeight: 1 }} />
                    <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{c.schedule}</span>
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
