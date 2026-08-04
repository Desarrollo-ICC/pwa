"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { ChevronDown, ChevronUp } from "lucide-react";

interface InfoItem { id: number; section: string; title: string; content: string; }

// Nav tabs (Barra Superior Habitación — Figma) → anchor to sections in the single scroll
const NAV: { key: string; label: string }[] = [
  { key: "housekeeping",   label: "Servicios de Aseo" },
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
  const [info, setInfo] = useState<InfoItem[]>([]);
  const [heroImg, setHeroImg] = useState("/images/habitacion.jpg");
  const [active, setActive] = useState("housekeeping");
  const [openLav, setOpenLav] = useState<string | null>("Lavandería - Hombre");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    fetch("/api/habitacion/info").then(r => r.json()).then(d => {
      const items: InfoItem[] = d.info ?? [];
      setInfo(items);
      const hero = items.find(i => i.section === "hero_image");
      if (hero?.content) setHeroImg(hero.content);
    });
  }, []);

  const rowsBySection = useMemo(() => {
    const m: Record<string, InfoItem[]> = {};
    for (const i of info) (m[i.section] ??= []).push(i);
    return m;
  }, [info]);

  const visible = NAV.filter(s => s.key === "housekeeping" || (rowsBySection[s.key]?.length ?? 0) > 0);

  const scrollTo = (key: string) => {
    setActive(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />

      {/* Nav bar — below header, above hero (Figma: Barra Superior Habitación) */}
      <div className="bg-[#1B4332] sticky top-0 z-20" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
        <div className="flex gap-1 overflow-x-auto no-scrollbar px-3 py-2 md:justify-center">
          {visible.map(t => (
            <button
              key={t.key}
              onClick={() => scrollTo(t.key)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap text-center leading-tight ${active === t.key ? "bg-[#2D6A4F] text-white" : "text-white/85 hover:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <img src={heroImg} alt="Habitación" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1 }}>Habitación</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[14px] font-semibold px-6 py-2 rounded-full active:opacity-80 flex items-center gap-1.5">
            <span style={{ fontSize: 11 }}>‹</span> Volver
          </button>
        </div>
      </div>

      {/* Single continuous scroll — sections in Figma order, separated by hairlines */}
      <div className="px-6 py-7 pb-24 md:pb-12 md:max-w-3xl md:mx-auto">
        {visible.map((sec, idx) => (
          <section
            key={sec.key}
            ref={el => { sectionRefs.current[sec.key] = el; }}
            className={idx > 0 ? "pt-7 mt-7" : ""}
            style={idx > 0 ? { borderTop: "1px solid #E8DDD0", scrollMarginTop: 56 } : { scrollMarginTop: 56 }}
          >
            <SectionBody
              secKey={sec.key}
              label={sec.label}
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
  // ── Servicios de Aseo (housekeeping) ──
  if (secKey === "housekeeping") {
    return (
      <>
        <SectionTitle>{label}</SectionTitle>
        {rows.length > 0 ? (
          <div className="flex flex-col gap-4">
            {rows.map(item => (
              <div key={item.id}>
                <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }} className="mb-1">{item.title}</h3>
                <p className="text-[#3D2B1F] text-[14px] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>{item.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }} className="mb-1">Horarios de Atención:</h3>
            <p className="text-[#3D2B1F] text-[14px]" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>Housekeeping: 08:30 a 23:00</p>
            <p className="text-[#3D2B1F] text-[14px]" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>Almuerzo: 08:30 a 16:00</p>
          </div>
        )}
      </>
    );
  }

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
              <div key={item.id} className="bg-[#F3EDE4] rounded-2xl overflow-hidden" style={{ border: "1px solid #EDE6D8" }}>
                <button onClick={() => setOpenLav(open ? null : item.title)} className="w-full flex justify-between items-center px-4 py-3.5">
                  <span style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, lineHeight: 1, color: "#54432B" }} className="text-left">{item.title}</span>
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
        <p className="text-[#3D2B1F] text-[14px] leading-relaxed whitespace-pre-line mb-4" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>
          {intro.content}
        </p>
      )}
      <div className="flex flex-col gap-4">
        {rest.map(item => (
          <div key={item.id}>
            <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }} className="mb-1">
              {item.title}
            </h3>
            <p className="text-[#3D2B1F] text-[14px] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>
              {item.content}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
