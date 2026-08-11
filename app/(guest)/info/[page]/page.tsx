"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { ChevronRight } from "lucide-react";
import RichText from "@/components/RichText";

interface Block {
  id: number; page: string; pageTitle: string; block: string;
  title: string | null; content: string | null; image: string | null;
}

const HERO_FALLBACK: Record<string, string> = {
  "circuitos-hidrotermales": "/images/spa.jpg",
  "sala-yoga": "/images/spa.jpg",
  "piscinas": "/images/spa.jpg",
  "clases-ski": "/images/actividades.jpg",
  "guarda-ski": "/images/actividades.jpg",
  "mi-estadia": "/images/habitacion.jpg",
  "check-in": "/images/habitacion.jpg",
  "servicios-incluidos": "/images/habitacion.jpg",
  "informacion-general": "/images/login-bg.jpg",
  "tiendas": "/images/home-hero.jpg",
};

// Imagen por destino para las tarjetas de los menús (Figma: cards con foto)
// Páginas que llevan barra superior de secciones (Figma: "Barra Superior ...")
const NAV_PAGES = new Set(["circuitos-hidrotermales"]);

const LINK_IMG: Record<string, string> = {
  "/info/servicios-incluidos":      "/images/home-hero.jpg",
  "/info/check-in":                 "/images/habitacion.jpg",
  "/info/guarderia":                "/images/ninos.jpg",
  "/habitacion":                    "/images/habitacion.jpg",
  "/info/uso-llaves":               "/images/habitacion.jpg",
  "/info/reglamento":               "/images/login-bg.jpg",
  "/info/tiendas":                  "/images/home-hero.jpg",
  "/info/espacios":                 "/images/login-bg.jpg",
  "/info/politicas-reserva":        "/images/login-bg.jpg",
  "/info/backcountry-store":        "/images/actividades.jpg",
  "/info/venta-recepcion":          "/images/home-hero.jpg",
  "/info/articulos-spa":            "/images/spa.jpg",
  "/actividades":                   "/images/actividades.jpg",
  "/info/clases-ski":               "/images/actividades.jpg",
  "/info/guarda-ski":               "/images/actividades.jpg",
  "/info/programa-viajero":         "/images/login-bg.jpg",
  "/info/plan-invierno":            "/images/actividades.jpg",
  "/info/preparativos":             "/images/actividades.jpg",
  "/info/estacionamientos":         "/images/home-hero.jpg",
};

// Caché en memoria por sesión: al volver a una página el hero y el contenido
// se pintan al instante (sin flash verde) mientras se refresca en segundo plano.
const pageCache = new Map<string, Block[]>();

export default function InfoPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = use(params);
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>(() => pageCache.get(page) ?? []);
  const [loading, setLoading] = useState(() => !pageCache.has(page));
  const [activeSec, setActiveSec] = useState<number | null>(null);

  useEffect(() => {
    if (pageCache.has(page)) { setBlocks(pageCache.get(page)!); setLoading(false); }
    else { setBlocks([]); setLoading(true); }
    fetch(`/api/info-pages?page=${encodeURIComponent(page)}`)
      .then(r => r.json())
      .then(d => { pageCache.set(page, d.blocks ?? []); setBlocks(d.blocks ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page]);

  const pageTitle = blocks[0]?.pageTitle ?? "";
  const heroImg = blocks.find(b => b.block === "hero")?.image ?? HERO_FALLBACK[page] ?? "/images/login-bg.jpg";
  const isEmergency = page === "emergencias";
  // Menu pages (only link blocks) render as image cards with a plain title — no hero (Figma)
  const visibleBlocks = blocks.filter(b => b.block !== "hero");
  const isMenu = visibleBlocks.length > 0 && visibleBlocks.every(b => b.block === "link");

  const hasHero = blocks.some(b => b.block === "hero");

  // Menú con hero (Figma: Tiendas) → hero + filas simples con chevron
  if (isMenu && hasHero) {
    return (
      <div className="min-h-svh bg-[#FFFBF3]">
        <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          {!loading && <HeroImage src={heroImg} alt={pageTitle} />}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05, maxWidth: 340 }}>{pageTitle}</h1>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <VolverButton />
          </div>
        </div>
        <div className="px-5 py-7 pb-24 md:pb-12 md:max-w-2xl md:mx-auto flex flex-col gap-3">
          {visibleBlocks.map(b => (
            <Link
              key={b.id}
              href={b.content ?? "#"}
              className="flex justify-between items-center px-4 py-4 rounded-2xl bg-[#F3ECE4] border border-[#EDE6D8] shadow-sm active:opacity-80"
            >
              <span style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }}>{b.title}</span>
              <ChevronRight size={18} className="text-[#9B9280] shrink-0" />
            </Link>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  if (isMenu) {
    return (
      <div className="min-h-svh bg-[#FFFBF3]">
        <div className="pt-14 px-4 pb-24 md:pb-12 md:max-w-2xl md:mx-auto">
          <h1 className="text-center mt-10 mb-6" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40, lineHeight: 1, color: "#54432B" }}>
            {pageTitle}
          </h1>
          <div className="flex flex-col items-center gap-[46px]">
            {visibleBlocks.map(b => (
              <Link
                key={b.id}
                href={b.content ?? "#"}
                className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform"
                style={{ height: 114 }}
              >
                <img src={b.image ?? LINK_IMG[b.content ?? ""] ?? "/images/login-bg.jpg"} alt={b.title ?? ""} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center px-4">
                  <span className="text-white font-bold text-center drop-shadow-md" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 24, lineHeight: 1.1 }}>
                    {b.title}
                  </span>
                </div>
              </Link>
            ))}
            <VolverButton />
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Barra superior de secciones (Figma: "Barra Superior ...") — bajo el header, sobre el hero
  const navBlocks = NAV_PAGES.has(page) ? visibleBlocks.filter(b => b.block === "text" && b.title) : [];
  const anchorId = (b: Block) => `sec-${b.id}`;

  return (
    <div className="min-h-svh bg-[#FFFBF3]">

      {(navBlocks.length > 1 || (NAV_PAGES.has(page) && loading)) && (
        <div className="bg-[#215732] sticky top-[85px] md:top-[68px] z-40" style={{ minHeight: 56, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-3 py-3 md:justify-center">
            {navBlocks.map(b => (
              <button
                key={b.id}
                onClick={() => { setActiveSec(b.id); document.getElementById(anchorId(b))?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[15px] whitespace-nowrap transition-all ${activeSec === b.id ? "bg-[#0E371B] text-[#FFFBF3] font-medium" : "text-white/85 hover:text-white font-normal"}`}
              >
                {b.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero */}
      <div
        className="relative overflow-hidden shadow-lg bg-[#22382D]"
        style={{
          height: 293,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          background: isEmergency ? "linear-gradient(119.4deg, #AF4E2B 8.15%, #DB7C59 54.08%, #AF4E2B 100%)" : undefined,
        }}
      >
        {!isEmergency && !loading && <HeroImage src={heroImg} alt={pageTitle} />}
        {!isEmergency && <div className="absolute inset-0 bg-black/40" />}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1.05, maxWidth: 340 }}>
            {pageTitle || " "}
          </h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton white={isEmergency} />
        </div>
      </div>

      {/* Blocks */}
      <div className="px-5 py-7 pb-24 md:pb-12 md:max-w-3xl md:mx-auto flex flex-col gap-5">
        {loading && <p className="text-[#9B9280] text-center py-10 text-[14px]">Cargando…</p>}
        {!loading && visibleBlocks.length === 0 && (
          <p className="text-[#9B9280] text-center py-10 text-[14px]">Sin información disponible aún.</p>
        )}
        {(() => {
          const out: React.ReactNode[] = [];
          for (let i = 0; i < visibleBlocks.length; i++) {
            const b = visibleBlocks[i];
            if (b.block === "card") {
              // agrupa tarjetas consecutivas en un carrusel (Figma)
              const group: Block[] = [];
              while (i < visibleBlocks.length && visibleBlocks[i].block === "card") group.push(visibleBlocks[i++]);
              i--;
              out.push(
                <div key={`cards-${group[0].id}`} className="flex overflow-x-auto no-scrollbar gap-4 -mx-1 px-1 pb-2" style={{ scrollSnapType: "x mandatory" }}>
                  {group.map(c => {
                    // desc = líneas normales; metas = líneas que empiezan con @ (Figma: fila con ícono dorado)
                    const allLines = (c.content ?? "").split("\n");
                    const desc = allLines.filter(l => !l.startsWith("@")).join("\n").trim();
                    const metas = allLines.filter(l => l.startsWith("@")).map(l => l.slice(1).trim());
                    const metaIcon = (m: string) => {
                      const t = m.toLowerCase();
                      if (t.includes("reserva") || t.includes("recepción")) return "fi-rs-calendar";
                      if (t.includes("hora")) return "fi-ts-clock-three";
                      return "fi-rs-marker";
                    };
                    return (
                      <div key={c.id} className="shrink-0 w-[82vw] max-w-[340px] bg-[#F3ECE4] rounded-2xl overflow-hidden border border-[#EDE6D8] shadow-sm snap-center">
                        <img src={c.image ?? heroImg} alt={c.title ?? ""} className="w-full h-[190px] object-cover" />
                        <div className="p-4">
                          <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 24, lineHeight: 1.1, color: "#54432B" }} className="mb-1.5">{c.title}</h3>
                          <p className="whitespace-pre-line" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, lineHeight: 1.4, color: "#54432B" }}>{desc}</p>
                          {metas.length > 0 && (
                            <>
                              <div className="mt-3 mb-2.5" style={{ borderTop: "1px solid #DBA33B" }} />
                              <div className="flex flex-col gap-1.5">
                                {metas.map((m, k) => (
                                  <div key={k} className="flex items-center gap-2">
                                    <i className={`${metaIcon(m)} shrink-0`} style={{ fontSize: 13, color: "#DBA33B", lineHeight: 1 }} />
                                    <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{m}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
              continue;
            }
            const needsRule = NAV_PAGES.has(page) && b.block === "text" && b.title && out.length > 0;
            // Filete sobre títulos de sección (Figma: 2px #D7D2CB, 46px de aire)
            const sectionRule = b.block === "section" && out.length > 0;
            out.push(
              <div
                key={b.id}
                id={`sec-${b.id}`}
                style={
                  sectionRule
                    ? { scrollMarginTop: 150, borderTop: "2px solid #D7D2CB", marginTop: 26, paddingTop: 46 }
                    : needsRule
                      ? { scrollMarginTop: 150, borderTop: "1px solid #E8DDD0", paddingTop: 20 }
                      : { scrollMarginTop: 150 }
                }
              >
                <BlockView b={b} emergency={isEmergency} />
              </div>
            );
          }
          return out;
        })()}
      </div>

      <BottomNav />
    </div>
  );
}

function BlockView({ b, emergency }: { b: Block; emergency: boolean }) {
  const lines = (b.content ?? "").split("\n").filter(l => l.trim());

  // Navigation link (menu pages)
  if (b.block === "link") {
    return (
      <Link
        href={b.content ?? "#"}
        className="flex justify-between items-center px-4 py-4 rounded-2xl bg-[#F3ECE4] border border-[#EDE6D8] shadow-sm active:opacity-80"
      >
        <span style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }}>{b.title}</span>
        <ChevronRight size={18} className="text-[#9B9280] shrink-0" />
      </Link>
    );
  }

  // Lead paragraph
  if (b.block === "intro") {
    return (
      <p className="text-[#3D2B1F] text-[16px] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>
        {b.content}
      </p>
    );
  }

  // Small print
  if (b.block === "note") {
    return (
      <p className="text-[#9B9280] text-[15px] leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>{b.content}</p>
    );
  }

  // Price table — desplegable cerrado por defecto (Ajustes 11.08)
  if (b.block === "price") {
    return <PriceCard title={b.title} lines={lines} />;
  }

  // Bulleted list
  if (b.block === "list") {
    return (
      <div>
        {b.title && !b.title.endsWith("— Pasos") && <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-2">{b.title}</h3>}
        <ul className="flex flex-col gap-2.5">
          {lines.map((l, i) => {
            const step = l.match(/^(.+?·.+?)\s+—\s+(.+)$/);
            if (step) {
              return (
                <li key={i} className={i > 0 ? "pt-2.5" : ""}>
                  <p className="font-bold text-[#3D2B1F] text-[14px]" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>{step[1].replace(" · ", " | ")}</p>
                  <p className="text-[#6B6B6B] text-[13px] leading-relaxed" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>{step[2]}</p>
                </li>
              );
            }
            return (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54432B] shrink-0 mt-2" />
                <span className="text-[#3D2B1F] text-[14px] leading-relaxed" style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>{l}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Emergency phone blocks render the content as a call button
  if (emergency && /^[+\d\s]+$/.test((b.content ?? "").trim())) {
    const tel = (b.content ?? "").replace(/\s/g, "");
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-[#3D2B1F] text-[14px] leading-relaxed">{b.title}</p>
        <a href={`tel:${tel}`} className="inline-block bg-[#DB7C59] text-white font-semibold text-[16px] px-10 py-3 rounded-full transition-colors hover:bg-[#C96A4B] active:bg-[#AF4E2B]">
          {b.content}
        </a>
      </div>
    );
  }

  // Filete divisor (Figma: 2px #D7D2CB)
  if (b.block === "divider") {
    return <div style={{ borderTop: "2px solid #D7D2CB", marginTop: 20, marginBottom: 20 }} />;
  }

  // Botón verde de enlace externo (Figma: "Botón verde 2" ancho completo, gradiente, texto Medium 20)
  if (b.block === "button") {
    return (
      <a
        href={b.content ?? "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full text-center active:opacity-80"
        style={{
          minHeight: 32,
          borderRadius: 25,
          padding: "3px 16px",
          background: "linear-gradient(90deg, #215732 0%, #47835A 50%, #215732 100%)",
          color: "#FFFBF3",
          fontFamily: "'Cooper Hewitt', sans-serif",
          fontWeight: 500,
          fontSize: 20,
          lineHeight: 1.2,
        }}
      >
        {b.title}
      </a>
    );
  }

  // Título de sección grande (Figma: Poltawski Bold 32, centrado — p.ej. "Traslados")
  if (b.block === "section") {
    return (
      <div>
        {b.title && <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1.1, color: "#54432B", textAlign: "center" }} className="mb-3">{b.title}</h2>}
        {b.content && <RichText text={b.content} />}
      </div>
    );
  }

  // Default: title + body
  return (
    <div>
      {b.title && <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1.15, color: "#54432B" }} className="mb-1.5">{b.title}</h3>}
      <RichText text={b.content ?? ""} />
    </div>
  );
}

// Card de precios desplegable (Ajustes 11.08: comienzan cerrados, muestran N productos)
function PriceCard({ title, lines }: { title: string | null; lines: string[] }) {
  const [open, setOpen] = useState(false);
  const rows = (
    <div className="flex flex-col divide-y divide-[#E8DDD0]">
      {lines.map((l, i) => {
        const [name, price] = l.split(/\s+—\s+/);
        return (
          <div key={i} className="flex justify-between items-center py-2.5">
            <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{name}</span>
            {price && <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#DBA33B" }}>{price}</span>}
          </div>
        );
      })}
    </div>
  );
  if (!title) return <div className="bg-[#F3ECE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 py-2">{rows}</div>;
  return (
    <div className="bg-[#F3ECE4] rounded-2xl border border-[#EDE6D8] shadow-sm px-4 py-2">
      <button onClick={() => setOpen(o => !o)} className="w-full flex justify-between items-center gap-3 py-2">
        <span className="text-left" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }}>{title}</span>
        <span className="flex items-center gap-2 shrink-0">
          <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 13, color: "#9B9280" }}>{lines.length} productos</span>
          <i className={`${open ? "fi-rs-angle-up" : "fi-rs-angle-down"}`} style={{ fontSize: 13, color: "#B9AE9C" }} />
        </span>
      </button>
      {open && rows}
    </div>
  );
}
