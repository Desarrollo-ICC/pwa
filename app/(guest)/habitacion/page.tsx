"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { useUiTexts } from "@/components/useUiTexts";
import { ChevronDown, ChevronUp } from "lucide-react";
import RichText from "@/components/RichText";

interface InfoItem { id: number; section: string; title: string; content: string; }

// caché en memoria para navegación instantánea
let habCache: InfoItem[] | null = null;

// Nav tabs (Barra Superior Habitación — Figma) → anchor to sections in the single scroll
const NAV: { key: string; label: string }[] = [
  { key: "lavanderia",     label: "Lavandería" },
  { key: "caja",           label: "Caja de Seguridad" },
  { key: "minibar",        label: "Minibar" },
  { key: "room_service",   label: "Room Service" },
  { key: "almohadas",      label: "Menú de Almohadas" },
  { key: "climatizacion",  label: "Climatización" },
  { key: "redes",          label: "Redes y Contraseñas" },
  { key: "tv",             label: "TV" },
  { key: "guarda_maletas", label: "Guarda Maletas" },
  { key: "hidratacion",    label: "Punto de Hidratación" },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1.05, color: "#54432B", textAlign: "center" }} className="mb-4">
      {children}
    </h2>
  );
}

export default function HabitacionPage() {
  const router = useRouter();
  const [info, setInfo] = useState<InfoItem[]>(habCache ?? []);
  const uiText = useUiTexts("ui-habitacion");
  const [heroImg, setHeroImg] = useState<string | null>(habCache ? (habCache.find(i => i.section === "hero_image")?.content ?? "/images/habitacion.jpg") : null);
  const [active, setActive] = useState("lavanderia");
  const [openLav, setOpenLav] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    fetch("/api/habitacion/info").then(r => r.json()).then(d => {
      const items: InfoItem[] = d.info ?? [];
      habCache = items;
      setInfo(items);
      const hero = items.find(i => i.section === "hero_image");
      setHeroImg(hero?.content ?? "/images/habitacion.jpg");
    }).catch(() => setHeroImg("/images/habitacion.jpg"));
  }, []);

  const rowsBySection = useMemo(() => {
    const m: Record<string, InfoItem[]> = {};
    for (const i of info) (m[i.section] ??= []).push(i);
    return m;
  }, [info]);

  const visible = NAV.filter(s => (rowsBySection[s.key]?.length ?? 0) > 0);

  const scrollTo = (key: string) => {
    setActive(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-svh bg-[#FFFBF3]">

      {/* Nav bar — below header, above hero (Figma: Barra Superior Habitación) */}
      <div className="bg-[#215732] sticky top-[85px] md:top-[68px] z-40" style={{ minHeight: 56, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-3 md:justify-center">
          {visible.map(t => (
            <button
              key={t.key}
              onClick={() => scrollTo(t.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[15px] transition-all whitespace-nowrap text-center leading-tight ${active === t.key ? "bg-[#0E371B] text-[#FFFBF3] font-medium" : "text-white/85 hover:text-white font-normal"}`}
            >
              {uiText(`Sección — ${t.key}`, t.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <HeroImage src={heroImg} alt="Habitación" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1 }}>{uiText("Título", "Habitación")}</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton />
        </div>
      </div>

      {/* Single continuous scroll — sections in Figma order, separated by hairlines */}
      <div className="px-6 py-7 pb-24 md:pb-12 md:max-w-3xl md:mx-auto">
        {visible.map((sec, idx) => (
          <section
            key={sec.key}
            ref={el => { sectionRefs.current[sec.key] = el; }}
            className={idx > 0 ? "pt-7 mt-7" : ""}
            style={idx > 0 ? { borderTop: "1px solid #E8DDD0", scrollMarginTop: 150 } : { scrollMarginTop: 150 }}
          >
            <SectionBody
              secKey={sec.key}
              label={uiText(`Sección — ${sec.key}`, sec.label)}
              rows={rowsBySection[sec.key] ?? []}
              openLav={openLav}
              setOpenLav={setOpenLav}
            />
          </section>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

function SectionBody({ secKey, label, rows, openLav, setOpenLav }: {
  secKey: string;
  label: string;
  rows: InfoItem[];
  openLav: string | null;
  setOpenLav: (v: string | null) => void;
}) {
  // ── Lavandería — collapsible price cards (Figma) ──
  if (secKey === "lavanderia") {
    return (
      <>
        <SectionTitle>{label}</SectionTitle>
        <div className="flex flex-col gap-3">
          {rows.map(item => {
            const open = openLav === item.title;
            const lines = (item.content ?? "").split("\n").filter(l => l.trim());
            return (
              <div key={item.id} className="bg-[#F3ECE4] rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE6D8" }}>
                <button onClick={() => setOpenLav(open ? null : item.title)} className="w-full flex justify-between items-center gap-3 px-4 py-3.5">
                  <span className="flex-1 text-left">
                    <span className="block" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, lineHeight: 1, color: "#54432B" }}>{item.title}</span>
                    <span className="block my-2" style={{ height: 1, backgroundColor: "#D7D2CB" }} />
                    <span className="block" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 13, color: "#9B9280" }}>{lines.length} artículos</span>
                  </span>
                  {open ? <ChevronUp size={16} className="text-[#B9AE9C] shrink-0" /> : <ChevronDown size={16} className="text-[#B9AE9C] shrink-0" />}
                </button>
                {open && (
                  <div className="px-4 pb-4 flex flex-col">
                    {lines.map((l, i) => {
                      const [name, price] = l.split(/\s+—\s+/);
                      return (
                        <div key={i} className="flex justify-between items-center py-[7px]" style={i > 0 ? { borderTop: "1px solid #EAE2D4" } : {}}>
                          <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 14, color: "#54432B" }}>{name}</span>
                          {price && <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 14, fontWeight: 600, color: "#DBA33B" }}>{price}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // ── Generic info section — plain text on cream (Figma style, no cards) ──
  // First row whose title equals the section label provides the intro paragraph.
  const intro = rows.find(r => r.title === label || r.title === label.replace("Menú de ", "Menú de "));
  const rest = rows.filter(r => r !== intro);
  return (
    <>
      <SectionTitle>{label}</SectionTitle>
      {intro && (
        <RichText text={intro.content} className="text-[#3D2B1F] text-[14px] leading-relaxed mb-4" />
      )}
      <div className="flex flex-col gap-4">
        {rest.map(item => (
          <div key={item.id}>
            <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }} className="mb-1">
              {item.title}
            </h3>
            <RichText text={item.content} />
          </div>
        ))}
      </div>
    </>
  );
}
