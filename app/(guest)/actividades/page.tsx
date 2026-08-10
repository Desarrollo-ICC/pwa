"use client";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface Activity {
  id: number;
  season: string;
  category: string;
  name: string;
  description: string | null;
  price: string | null;
  image: string | null;
}

const CATEGORY_ORDER_VERANO = [
  "Caminatas y Trekking",
  "Bicicleta",
  "Contemplación y Recreación",
  "Bienestar y Talleres Indoor",
  "Niños",
  "Otras Actividades",
];

const CATEGORY_ORDER_INVIERNO = [
  "Deportes de Nieve",
  "Exploración & Naturaleza",
  "Bienestar y Talleres Indoor",
  "Niños",
];

// Intros de cada categoría (Figma) — editables en admin: Páginas de Información → ui-actividades
const CAT_INTROS: Record<string, string> = {
  "Caminatas y Trekking":       "Exploración del entorno natural. Snacks incluidos y cocktail en salidas de puesta de sol.",
  "Bicicleta":                  "Recorridos de diversos niveles por los alrededores del hotel y el Valle de las Trancas.",
  "Contemplación y Recreación": "Actividades de aprendizaje, respeto por la naturaleza y aventura.",
  "Bienestar y Talleres Indoor":"Actividades de activación corporal, arte y gastronomía.",
  "Niños":                      "Actividades de activación corporal, arte y gastronomía.",
  "Deportes de Nieve":          "Vive la montaña al máximo: adrenalina en la nieve, aventuras en la naturaleza y momentos de bienestar y relax.",
  "Exploración & Naturaleza":   "Vive la montaña al máximo: adrenalina en la nieve, aventuras en la naturaleza y momentos de bienestar y relax.",
};

const CAT_FALLBACKS: Record<string, string> = {
  "Caminatas y Trekking":       "/images/actividades.jpg",
  "Bicicleta":                  "/images/actividades.jpg",
  "Contemplación y Recreación": "/images/login-bg.jpg",
  "Bienestar y Talleres Indoor":"/images/spa.jpg",
  "Otras Actividades":          "/images/home-hero.jpg",
  "Niños":                      "/images/ninos.jpg",
  "Deportes de Nieve":          "/images/actividades.jpg",
  "Exploración & Naturaleza":   "/images/login-bg.jpg",
};

function catKey(cat: string) {
  return "act_cat_" + cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

function shortDesc(desc: string | null): string {
  if (!desc) return "";
  return desc.split("\n")[0];
}

function extractBullets(desc: string | null): string[] {
  if (!desc) return [];
  return desc
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(1, 7);
}

function bulletIcon(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("hora") || t.includes("minuto") || t.includes("duración")) return "fi-ts-clock";
  if (t.includes("altitud") || t.includes("msnm")) return "fi-ts-mountain";
  if (t.includes("dificultad")) return "fi-ts-bolt";
  if (t.includes("km") || t.includes("distancia")) return "fi-ts-route";
  if (t.includes("pasajero") || t.includes("persona") || t.includes("guía") || t.includes("grupo")) return "fi-ts-users";
  if (t.includes("costo") || t.includes("precio") || t.includes("adicional")) return "fi-ts-receipt";
  if (t.includes("reserva") || t.includes("recepción") || t.includes("anexo")) return "fi-ts-info";
  return "fi-ts-check";
}

function ActivityCard({ activity, catImage }: { activity: Activity; catImage: string }) {
  const bullets = extractBullets(activity.description);
  const imgSrc = activity.image ?? catImage;

  return (
    <div className="shrink-0 w-[82vw] max-w-[340px] bg-[#F3EDE4] rounded-2xl overflow-hidden shadow-sm snap-center">
      <div className="relative h-[245px] w-full bg-gray-200">
        <img src={imgSrc} alt={activity.name} className="absolute inset-0 w-full h-full object-cover" />
        {activity.price && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-[12px] font-semibold text-[#1B4332]">
            {activity.price}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-playfair font-bold text-[#54432B] text-[24px] leading-none mb-1.5">
          {activity.name}
        </h3>
        <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: "#3F2012" }} className="mb-3">
          {shortDesc(activity.description)}
        </p>
        {bullets.length > 0 && (
          <ul className="flex flex-col gap-2">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#1B4332]/10 flex items-center justify-center shrink-0">
                  <i className={`${bulletIcon(b)} text-[#DBA33B]`} style={{ fontSize: 11 }} />
                </span>
                <span className="text-[#3D3D3D] text-[13px] leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 pt-2.5 flex items-center gap-2 text-[#9B9280] text-[11px]" style={{ borderTop: "1px solid #E8DDD0" }}>
          <i className="fi-ts-info" style={{ fontSize: 12 }} />
          <span>Para más información, acércate al mesón de recepción</span>
        </div>
      </div>
    </div>
  );
}

function CentroDeSkiView({ onBack, skiActivities }: { onBack: () => void; skiActivities: Activity[] }) {
  const [weather, setWeather] = useState<{ temp: number; feels: number; humidity: number; wind: number; code: number } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-36.908&longitude=-71.432&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh"
    )
      .then((r) => r.json())
      .then((d) => {
        const c = d.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          wind: Math.round(c.wind_speed_10m),
          code: c.weather_code,
        });
      })
      .catch(() => {});
  }, []);

  function weatherIcon(code: number) {
    if (code === 0) return "fi-ts-sun";
    if (code <= 3) return "fi-ts-cloud-sun";
    if (code <= 49) return "fi-ts-clouds";
    if (code <= 69) return "fi-ts-cloud-drizzle";
    if (code <= 79) return "fi-ts-cloud-snow";
    if (code <= 99) return "fi-ts-cloud-bolt";
    return "fi-ts-sun";
  }

  const rentaPorDia = skiActivities.filter((a) => a.category === "SKI – Renta por Día");
  const rentaSemanal = skiActivities.filter((a) => a.category === "SKI – Renta Semanal");
  const servicios = skiActivities.filter((a) => a.category === "SKI – Servicios");

  const rows = [
    { key: "reporte", label: "Reporte de Andariveles y Pistas", href: "https://termaschillan.cl/informacion-centro-de-ski/" },
  ];

  return (
    <div className="pb-24">
      {/* Hero */}
      <div className="relative overflow-hidden w-full" style={{ height: 260, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <img src="/images/actividades.jpg" alt="Centro de Ski" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="font-playfair font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1, color: "white" }}>
            Centro de Ski
          </h2>
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex justify-center">
          <button onClick={onBack} className="bg-[#1B4332] text-white text-[14px] font-semibold px-5 py-2 rounded-full active:opacity-80 flex items-center gap-1.5">
            <i className="fi-ts-angle-left" style={{ fontSize: 12 }} />
            Volver
          </button>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-md mx-auto">
        {/* Description */}
        <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 14, color: "#3D2B1F", lineHeight: 1.55 }} className="mb-3">
          SKI con más de 35 km de pistas y opciones para todos los niveles. Vive una experiencia en un entorno natural privilegiado.
        </p>

        {/* Info note */}
        <div className="flex items-center gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid #E8DDD0" }}>
          <i className="fi-ts-info" style={{ fontSize: 13, color: "#D4722A" }} />
          <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 13, color: "#9B9280" }}>
            Para más información, acércate al mesón de recepción
          </span>
        </div>

        {/* Weather widget */}
        {weather ? (
          <div className="rounded-2xl p-4 mb-5 flex items-center justify-between" style={{ backgroundColor: "#1B4332" }}>
            <div>
              <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.65)" }} className="mb-0.5">
                Clima en Chillán
              </p>
              <p className="font-playfair font-bold text-white" style={{ fontSize: 48, lineHeight: 1 }}>
                {weather.temp}<span style={{ fontSize: 22 }}>°C</span>
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2">
                <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                  Sensación: <strong>{weather.feels}°C</strong>
                </span>
                <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                  Humedad: <strong>{weather.humidity}%</strong>
                </span>
                <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.85)" }}>
                  Viento: <strong>{weather.wind} km/h</strong>
                </span>
              </div>
            </div>
            <div className="w-[52px] h-[52px] rounded-xl bg-white/20 flex items-center justify-center shrink-0 ml-3">
              <i className={`${weatherIcon(weather.code)} text-white`} style={{ fontSize: 26 }} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl mb-5 animate-pulse" style={{ backgroundColor: "#1B4332", height: 100 }} />
        )}

        {/* Rows */}
        <div style={{ borderTop: "1px solid #E8DDD0" }}>
          {rows.map((row, idx) => (
            <div key={row.key} style={{ borderBottom: "1px solid #E8DDD0" }}>
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-4 active:opacity-60"
                >
                  <span className="font-playfair font-bold text-[#54432B]" style={{ fontSize: 18 }}>{row.label}</span>
                  <i className="fi-ts-angle-right text-[#54432B]" style={{ fontSize: 14 }} />
                </a>
              ) : (
                <>
                  <button
                    className="w-full flex items-center justify-between py-4 active:opacity-60"
                    onClick={() => setExpanded(expanded === row.key ? null : row.key)}
                  >
                    <span className="font-playfair font-bold text-[#54432B] text-left" style={{ fontSize: 18 }}>{row.label}</span>
                    <i className={`fi-ts-angle-${expanded === row.key ? "down" : "right"} text-[#54432B]`} style={{ fontSize: 14 }} />
                  </button>
                  {expanded === "precios" && row.key === "precios" && (
                    <div className="pb-4">
                      {[
                        { title: "Renta por Día", items: rentaPorDia },
                        { title: "Renta Semanal", items: rentaSemanal },
                        { title: "Servicios", items: servicios },
                      ].filter((g) => g.items.length > 0).map((group) => (
                        <div key={group.title} className="mb-4">
                          <p className="font-playfair font-bold text-[#54432B] mb-2" style={{ fontSize: 15 }}>{group.title}</p>
                          {group.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid #F0E8DF" }}>
                              <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 13, color: "#3D2B1F" }}>{item.name}</span>
                              {item.price && (
                                <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 13, fontWeight: 700, color: "#1B4332" }}>{item.price}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivitySlider({ activities, catImage }: { activities: Activity[]; catImage: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector<HTMLElement>("[data-card]")?.offsetWidth ?? 340;
    el.scrollBy({ left: dir === "right" ? cardWidth + 16 : -(cardWidth + 16), behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Desktop arrows */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-[#54432B] hover:bg-[#F3EDE4] transition-colors"
        aria-label="Anterior"
      >
        <i className="fi-ts-angle-left" style={{ fontSize: 16 }} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 items-center justify-center text-[#54432B] hover:bg-[#F3EDE4] transition-colors"
        aria-label="Siguiente"
      >
        <i className="fi-ts-angle-right" style={{ fontSize: 16 }} />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto no-scrollbar gap-4 px-[9%] py-4"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {activities.map((a) => (
          <div key={a.id} data-card>
            <ActivityCard activity={a} catImage={catImage} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ActividadesPage() {
  const [season, setSeason] = useState<"verano" | "invierno">("verano");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  // Lee ?cat= sin useSearchParams (evita requerir un boundary de Suspense en el build)
  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get("cat");
    if (cat) {
      setSelectedCat(cat);
      if (cat === "Centro de Ski" || cat.startsWith("SKI")) setSeason("invierno");
    }
  }, []);
  const [catImgMap, setCatImgMap] = useState<Record<string, string>>({});
  const [clubs, setClubs] = useState<Activity[]>([]);
  // Textos editables desde el admin (Páginas de Información → ui-actividades)
  const [ui, setUi] = useState<Record<string, { title: string; content: string }>>({});

  useEffect(() => {
    fetch("/api/actividades")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities ?? []));
    fetch("/api/info-pages?page=ui-actividades")
      .then((r) => r.json())
      .then((d) => {
        const m: Record<string, { title: string; content: string }> = {};
        for (const b of (d.blocks ?? [])) m[b.title ?? b.block] = { title: b.title ?? "", content: b.content ?? "" };
        setUi(m);
      })
      .catch(() => {});
    fetch("/api/familia")
      .then((r) => r.json())
      .then((d) => {
        const rows = (d.programs ?? []).filter((p: { type: string }) => p.type === "club");
        setClubs(rows.map((p: { id: number; name: string; description: string | null; image: string | null }) => ({
          id: 100000 + p.id, season: "", category: "Niños", name: p.name, description: p.description, price: null, image: p.image,
        })));
      });
    fetch("/api/habitacion/info")
      .then((r) => r.json())
      .then((d) => {
        const allCats = [...CATEGORY_ORDER_VERANO, ...CATEGORY_ORDER_INVIERNO];
        const map: Record<string, string> = {};
        for (const item of (d.info ?? [])) {
          if (item.section?.startsWith("act_cat_")) {
            const cat = allCats.find(c => catKey(c) === item.section);
            if (cat) map[cat] = item.content;
          }
        }
        setCatImgMap(map);
      });
  }, []);

  const uiText = (key: string, fallback: string) => ui[key]?.content ?? fallback;
  const getCatImg = (cat: string) => catImgMap[cat] ?? CAT_FALLBACKS[cat] ?? "/images/actividades.jpg";

  const CATEGORY_ORDER = season === "verano" ? CATEGORY_ORDER_VERANO : CATEGORY_ORDER_INVIERNO;

  const filtered = activities.filter((a) => a.season === season);
  const byCategory = filtered.reduce<Record<string, Activity[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  const allCategories = season === "invierno"
    ? CATEGORY_ORDER_INVIERNO
    : [
        ...CATEGORY_ORDER_VERANO,
        ...Object.keys(byCategory).filter((c) => !CATEGORY_ORDER_VERANO.includes(c)),
      ];

  const catActivities = selectedCat ? (byCategory[selectedCat] ?? []) : [];
  const freeActs = catActivities.filter((a) => !a.price);
  const paidActs = catActivities.filter((a) => a.price);
  const isOtras = selectedCat === "Otras Actividades";

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />

      <div className={selectedCat ? "" : "pt-14"}>

        {!selectedCat ? (
          /* ── Category list ── */
          <div className="flex flex-col">
          {/* Season toggle */}
          <div className="flex gap-2 px-4 pt-8 pb-3 bg-[#FFFBF3] justify-center">
            {(["verano", "invierno"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setSeason(s); setSelectedCat(null); }}
                className={`px-8 py-2 rounded-full transition-all border font-playfair font-bold text-center text-lg md:text-xl ${
                  season === s ? "bg-[#1B4332] text-white border-[#1B4332]" : "text-[#1B4332] border-[#1B4332]/40 bg-transparent"
                }`}
              >
                {s === "verano" ? "Verano" : "Invierno"}
              </button>
            ))}
          </div>
          <div className="px-5 py-6 md:max-w-3xl md:mx-auto">
            <h1 className="font-playfair font-bold text-center mb-6" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>
              Experiencias y Actividades
            </h1>
            {allCategories.length === 0 && activities.length === 0 && (
              <p className="text-[#9B9280] text-center py-10 text-[14px]">Cargando actividades…</p>
            )}
            {allCategories.length > 0 && (
              <div className="flex flex-col items-center gap-[46px] pb-6">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform card-enter"
                    style={{ height: 114 }}
                  >
                    <img src={getCatImg(cat)} alt={cat} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-playfair font-bold text-center" style={{ fontSize: 24, lineHeight: 1, color: 'white' }}>{cat}</span>
                    </div>
                  </button>
                ))}
                <div className="w-full max-w-sm border-t border-[#E8DDD0] pt-5">
                  <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 24, color: "#54432B" }} className="mb-2">Cuidado del Entorno</h3>
                  <p className="text-[#3D2B1F] text-[13px] leading-relaxed mb-2">{uiText("Cuidado del Entorno", "Nos comprometemos a mantener el bosque en su estado natural y te pedimos que nos acompañes en ese cuidado:")}</p>
                  <ul className="flex flex-col gap-1.5">
                    {uiText("Cuidado del Entorno — puntos", "Regresa siempre con tu basura al hotel.\nEvita fumar o encender fuego fuera de las áreas permitidas.\nDurante el verano el riesgo de incendios es muy alto. Tu precaución protege el entorno de todos.").split("\n").filter(Boolean).map((t, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]/40 shrink-0 mt-1.5" />
                        <span className="text-[#3D2B1F] text-[13px] leading-relaxed">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={() => window.history.back()} className="bg-[#1B4332] text-white px-6 py-1 rounded-full text-[15px] font-medium active:opacity-80 mb-20"><i className="fi-rs-angle-left" style={{ fontSize: 11, marginRight: 6 }} />Volver</button>
              </div>
            )}
          </div>
          </div>
        ) : selectedCat === "Centro de Ski" ? (
          <CentroDeSkiView onBack={() => setSelectedCat(null)} skiActivities={activities.filter(a => a.season === "invierno" && a.category.startsWith("SKI –"))} />
        ) : (
          <div className="pb-24 md:pb-12">
            {/* Hero — full width */}
            <div className="relative overflow-hidden w-full" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
              <img
                src={getCatImg(selectedCat)}
                alt={selectedCat}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              {/* Category title centered */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="font-playfair font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1, color: 'white' }}>
                  {selectedCat}
                </h2>
              </div>
              {/* Volver button bottom center */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button onClick={() => setSelectedCat(null)} className="bg-[#1B4332] text-white text-[15px] font-medium px-6 py-1 rounded-full active:opacity-80"><i className="fi-rs-angle-left" style={{ fontSize: 11, marginRight: 6 }} />Volver</button>
              </div>
            </div>

            <div className="pt-2 md:max-w-4xl md:mx-auto">
              {selectedCat !== "Otras Actividades" && (CAT_INTROS[selectedCat] || ui[`Intro — ${selectedCat}`]) && (
                <div className="px-5 pt-4 pb-4 mx-4" style={{ borderBottom: "1px solid #E8DDD0" }}>
                  <p className="text-[#3D2B1F] text-[14px] leading-relaxed">{uiText(`Intro — ${selectedCat}`, CAT_INTROS[selectedCat] ?? "")}</p>
                  <div className="flex items-start gap-2 mt-2.5">
                    <i className="fi-rs-calendar shrink-0" style={{ fontSize: 12, color: "#DBA33B", marginTop: 2 }} />
                    <p className="text-[#9B9280] text-[12px]">{uiText("Nota mesón", "Conoce las actividades disponibles consultando en el mesón de experiencias.")}</p>
                  </div>
                </div>
              )}
              {catActivities.length === 0 ? (
                <p className="text-[#9B9280] text-center py-10 text-[14px] px-4">Próximamente actividades disponibles</p>
              ) : isOtras ? (
                <>
                  {freeActs.length > 0 && (
                    <>
                      <h3 className="font-playfair font-bold text-center px-4 mt-4 mb-1" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>Actividades Gratuitas</h3>
                      <p className="text-[#3D2B1F] text-[14px] text-center px-6 mb-1">{uiText("Actividades Gratuitas", "Acceso a espacios deportivos y recreativos en las dependencias del hotel.")}</p>
                      <p className="text-[#9B9280] text-[13px] text-center px-6 mb-1">{uiText("Nota mesón", "Conoce las actividades disponibles consultando en el mesón de experiencias.")}</p>
                      <ActivitySlider activities={freeActs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                  {paidActs.length > 0 && (
                    <>
                      <h3 className="font-playfair font-bold text-center px-4 mt-4 mb-1" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>Actividades con Costo Extra</h3>
                      <p className="text-[#3D2B1F] text-[14px] text-center px-6 mb-1">{uiText("Actividades con Costo Extra", "Experiencias para explorar el entorno.")}</p>
                      <p className="text-[#9B9280] text-[13px] text-center px-6 mb-1">{uiText("Nota mesón", "Conoce las actividades disponibles consultando en el mesón de experiencias.")}</p>
                      <ActivitySlider activities={paidActs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                </>
              ) : selectedCat === "Niños" ? (
                <>
                  {catActivities.length > 0 && (
                    <>
                      <h3 className="font-playfair font-bold text-center px-4 mt-4 mb-1" style={{ fontSize: 32, lineHeight: 1, color: '#54432B' }}>Actividades de Temporada</h3>
                      <ActivitySlider activities={catActivities} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                  {clubs.length > 0 && (
                    <>
                      <h3 className="font-playfair font-bold text-center px-4 mt-4 mb-1" style={{ fontSize: 32, lineHeight: 1, color: '#54432B' }}>Actividades</h3>
                      <ActivitySlider activities={clubs} catImage={getCatImg(selectedCat)} />
                    </>
                  )}
                </>
              ) : (
                <ActivitySlider activities={catActivities} catImage={getCatImg(selectedCat)} />
              )}
            </div>

            <div className="px-5 mt-6 mb-8 text-center">
              <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: 1, color: '#DB7C59', textAlign: 'center' }}>
                {uiText("Nota full day", "Las actividades full day son operadas por proveedor externo y tienen costo adicional.")}
              </p>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
