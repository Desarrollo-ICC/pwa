"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BottomNav from "@/components/BottomNav";


interface Alert { id: number; title: string; message: string; type: string; }
interface Activity { id: number; season: string; category: string; name: string; description: string | null; price: string | null; image: string | null; }
interface Weather { temp: number; feelsLike: number; humidity: number; windSpeed: number; code: number; }
interface Event { id: number; day: string; month: string; time: string; title: string; description: string | null; location: string | null; }

// Accesos rápidos — orden y etiquetas del Figma (PWA- Home)
const DEFAULT_QUICK_LINKS = [
  { href: "/info/mi-estadia",          label: "Mi Estadía",                 iconClass: "fi-ts-bed-alt" },
  { href: "/restaurantes",             label: "Comer y Beber",              iconClass: "fi-ts-utensils" },
  { href: "/wellness",                 label: "Bienestar",                  iconClass: "fi-ts-hot-tub" },
  { href: "/actividades",              label: "Experiencias y Actividades", iconClass: "fi-ts-mountain" },
  { href: "/info/ski",                 label: "Ski",                        iconClass: "fi-ts-skiing" },
  { href: "/info/informacion-general", label: "Información General",        iconClass: "fi-ts-info" },
];

function weatherIcon(code: number): string {
  if (code === 0) return "fi-ts-sun";
  if (code <= 3) return "fi-ts-cloud-sun";
  if (code <= 48) return "fi-ts-clouds";
  if (code <= 67) return "fi-ts-cloud-drizzle";
  if (code <= 77) return "fi-ts-cloud-snow";
  if (code <= 86) return "fi-ts-cloud-drizzle";
  return "fi-ts-clouds";
}

function getCurrentSeason(): "verano" | "invierno" {
  const m = new Date().getMonth() + 1;
  return m >= 6 && m <= 10 ? "invierno" : "verano";
}

function extractField(desc: string | null, key: string): string | null {
  if (!desc) return null;
  const match = desc.match(new RegExp(key + ":\\s*([^\\n]+)"));
  return match ? match[1].trim() : null;
}

function shortDesc(desc: string | null): string {
  if (!desc) return "";
  return desc.split("\n")[0];
}

function ActivityCard({ a }: { a: Activity }) {
  const location = extractField(a.description, "Lugar");
  const schedule = extractField(a.description, "Horario") ?? extractField(a.description, "Duración");

  return (
    <div className="shrink-0 w-[335px] h-[470px] bg-[#F3ECE4] rounded-3xl overflow-hidden shadow-sm snap-center flex flex-col border border-[#E0D8CC]">
      <div className="w-full h-[252px] relative overflow-hidden bg-[#1B4332] shrink-0">
        {a.image ? (
          <Image src={a.image} alt={a.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B4332] to-[#47835A]" />
        )}
        {a.price && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-[12px] font-semibold text-[#1B4332]">
            {a.price}
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-playfair font-bold text-[#54432B] text-[24px] leading-none mb-2">{a.name}</h3>
        <p style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 400, fontSize: 16, lineHeight: 1.4, color: "#3F2012" }} className="line-clamp-3 mb-3">{shortDesc(a.description)}</p>
        <div className="flex flex-col gap-1.5 mt-auto">
          {location && (
            <div className="flex items-center gap-1.5 text-[#7B6354]">
              <i className="fi-rs-marker shrink-0" style={{ fontSize: 12 }} />
              <span className="text-[12px]">{location}</span>
            </div>
          )}
          {schedule && (
            <div className="flex items-center gap-1.5 text-[#7B6354]">
              <i className="fi-rs-clock-three shrink-0" style={{ fontSize: 12 }} />
              <span className="text-[12px]">{schedule}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[#9B9280]">
            <i className="fi-ts-info shrink-0" style={{ fontSize: 12 }} />
            <span className="text-[12px]">Para más información, acércate al mesón</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderWithArrows({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  };
  return (
    /* outer: centers content and gives horizontal room for arrows on desktop */
    <div className="md:max-w-5xl md:mx-auto md:px-14 relative">
      {/* Left arrow — desktop only, inside the padded area */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-[#1B4332] hover:bg-[#f0ebe3] transition"
        aria-label="Anterior"
      >
        <i className="fi-rs-angle-left" style={{ fontSize: 16 }} />
      </button>
      {/* Slider track */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 md:px-0"
      >
        {children}
      </div>
      {/* Right arrow — desktop only */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-white shadow-md text-[#1B4332] hover:bg-[#f0ebe3] transition"
        aria-label="Siguiente"
      >
        <i className="fi-rs-angle-right" style={{ fontSize: 16 }} />
      </button>
    </div>
  );
}

function getWelcome(name: string): string {
  const first = name.trim().split(/\s+/)[0].toLowerCase();
  const femaleEndings = ["a", "ia", "ina", "ela", "ela", "ila", "ara", "era", "ira", "ora", "ura"];
  const femaleNames = ["luz", "paz", "sol", "mar", "flor", "pilar", "inés", "ines", "belen", "belen", "ruth", "edith", "judith", "naomi", "noemi", "leah", "lea"];
  const maleNames = ["jose", "jorge", "jorge", "alex", "alexis", "elvis", "boris", "lucas", "matias", "nicolas", "andres", "carlos", "pablo", "daniel", "miguel", "angel", "samuel", "david", "juan", "pedro", "luis", "manuel", "roberto", "sergio", "oscar", "diego", "ivan", "ruben", "cesar", "hector", "victor"];
  if (maleNames.includes(first)) return "Bienvenido";
  if (femaleNames.includes(first)) return "Bienvenida";
  if (femaleEndings.some(e => first.endsWith(e))) return "Bienvenida";
  return "Bienvenido";
}

export default function HomePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [guestName, setGuestName] = useState("Bienvenido/a");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [weather, setWeather] = useState<Weather | null>(null);
  // Accesos rápidos y textos de emergencia editables desde el admin (ui-home)
  const [quickLinks, setQuickLinks] = useState(DEFAULT_QUICK_LINKS);
  const [ui, setUi] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem("htch_guest");
    if (!stored) { router.replace("/"); return; }
    const { name } = JSON.parse(stored);
    setGuestName(name.split(" ")[0]);
    setReady(true);

    fetch("/api/info-pages?page=ui-home")
      .then((r) => r.json())
      .then((d) => {
        const rows = d.blocks ?? [];
        const ls = rows.filter((b: { block: string }) => b.block === "link");
        if (ls.length) setQuickLinks(ls.map((b: { title: string; content: string }) => ({
          href: b.content, label: b.title,
          iconClass: DEFAULT_QUICK_LINKS.find(q => q.href === b.content)?.iconClass ?? "fi-ts-info",
        })));
        const m: Record<string, string> = {};
        for (const b of rows) if (b.title) m[b.title] = b.content ?? "";
        setUi(m);
      })
      .catch(() => {});

    fetch("/api/alerts")
      .then((r) => r.json())
      .then((data) => setAlerts(data.alerts ?? []))
      .catch(() => {});

    fetch("/api/actividades")
      .then((r) => r.json())
      .then((data) => setActivities(data.activities ?? []))
      .catch(() => {});

    fetch("/api/eventos")
      .then((r) => r.json())
      .then((data) => setUpcomingEvents(data.events ?? []))
      .catch(() => {});

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-36.6067&longitude=-72.1034&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=America/Santiago"
    )
      .then((r) => r.json())
      .then((data) => {
        const c = data.current;
        setWeather({
          temp: Math.round(c.temperature_2m),
          feelsLike: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          windSpeed: Math.round(c.wind_speed_10m),
          code: c.weather_code,
        });
      })
      .catch(() => {});
  }, [router]);

  const season = getCurrentSeason();
  const seasonActivities = activities.filter((a) => a.season === season).slice(0, 8);

  if (!ready) return null;

  return (
    <div className="min-h-svh bg-[#FFFBF3]">

      {/* Hero */}
      <div className="relative h-[293px] md:h-[420px] overflow-hidden rounded-b-[40px]">
        <img src="/images/home-hero.jpg" alt="Hotel Termas" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center pt-14">
          <h1 className="font-playfair text-white text-[32px] md:text-[36px] font-bold drop-shadow-lg leading-tight text-center">
            {getWelcome(guestName)},<br />{guestName}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 pb-24 md:pb-12">
        <div className="px-4 md:max-w-5xl md:mx-auto">
          <p className="font-playfair text-[#3D2B1F] text-[32px] md:text-[36px] font-bold text-center mb-5">
            Encuentra toda la información<br />que necesites aquí
          </p>

          {/* Quick links grid — 5 items, 3+2 on mobile, all in one row on desktop */}
          {/* Grilla 3×2 alineada al ancho del contenedor (Figma: mismo ancho que la card de alertas, gap 20) */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-5 mb-5">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block">
                <div className="rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform justify-center w-full aspect-square" style={{ background: "linear-gradient(180deg, #215732 0%, #47835A 50%, #215732 100%)" }}>
                  <i className={`${link.iconClass} text-white`} style={{ fontSize: 38 }} />
                  <span className="text-white text-center px-1" style={{ fontFamily: "'Cooper Hewitt', system-ui, sans-serif", fontWeight: 500, fontSize: 14, lineHeight: 1.15, color: "#FFFBF3" }}>{link.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Filete bajo los accesos (Figma: Vector 10) */}
          <div className="md:hidden" style={{ borderTop: "2px solid #D7D2CB", marginTop: 46, marginBottom: 46 }} />

          {/* Alertas — mobile: below quick links, desktop: moved to clima row */}
          <div className="md:hidden">
            {alerts.length > 0 ? (
              <div className="flex flex-col gap-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-[#DB7C59] rounded-2xl px-4 py-3 flex items-center gap-3">
                    <i className="fi-ts-bell text-white" style={{ fontSize: 18 }} />
                    <div className="flex-1">
                      <p className="text-white" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{alert.title}</p>
                      <p className="text-white/80 text-[12px]">{alert.message}</p>
                    </div>
                    <i className="fi-rs-angle-right text-white" style={{ fontSize: 16 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F3ECE4] rounded-2xl px-4 flex items-center gap-3" style={{ height: 70 }}>
                <i className="fi-ts-bell" style={{ fontSize: 18, color: "#DB7C59" }} />
                <p className="text-[15px] font-medium" style={{ color: "#DB7C59", fontFamily: "'Cooper Hewitt', sans-serif" }}>No hay Alertas</p>
              </div>
            )}
          </div>
        </div>

        {/* Clima + Alertas side by side on desktop */}
        <div className="px-4 md:max-w-5xl md:mx-auto md:flex md:gap-4 md:items-stretch" style={{ marginTop: 45 }}>
          {/* Alertas desktop — izquierda */}
          <div className="hidden md:flex flex-col gap-2 md:flex-1">
            {alerts.length > 0 ? (
              <div className="rounded-2xl px-5 py-4 flex flex-col gap-3 h-full" style={{ background: "linear-gradient(135deg, #C96A46 0%, #DB7C59 100%)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <i className="fi-ts-bell text-white" style={{ fontSize: 16 }} />
                  <p className="text-white/80 text-[11px] font-semibold uppercase tracking-wide">Alertas</p>
                </div>
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 border-t border-white/20 pt-3 first:border-0 first:pt-0">
                    <div className="flex-1">
                      <p className="text-white font-bold text-[16px] leading-snug">{alert.title}</p>
                      <p className="text-white/80 text-[12px] mt-0.5">{alert.message}</p>
                    </div>
                    <i className="fi-rs-angle-right text-white/60 shrink-0 mt-1" style={{ fontSize: 13 }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl px-5 py-4 flex flex-col justify-center h-full" style={{ background: "linear-gradient(135deg, #E8DDD0 0%, #EDE6D8 100%)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <i className="fi-ts-bell" style={{ fontSize: 16, color: "#7B6354" }} />
                  <p className="text-[#7B6354] text-[11px] font-semibold uppercase tracking-wide">Alertas</p>
                </div>
                <p className="text-[#7B6354] text-[13px] font-medium">Sin alertas activas hoy</p>
              </div>
            )}
          </div>

          {/* Clima — derecha */}
          {weather && (
            <div className="rounded-2xl px-4 py-4 md:flex-1" style={{ background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)" }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-[11px] mb-0.5">Clima en Chillán</p>
                  <p className="text-white leading-none" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 48, lineHeight: 1 }}>{weather.temp}<span style={{ fontSize: 24, fontWeight: 400 }}>°C</span></p>
                </div>
                <i className={`${weatherIcon(weather.code)} text-white`} style={{ fontSize: 34 }} />
              </div>
              <div className="flex gap-4 mt-3 text-white/80 text-[11px]">
                <span>Sensación: <span className="font-semibold text-white">{weather.feelsLike}°C</span></span>
                <span>Humedad: <span className="font-semibold text-white">{weather.humidity}%</span></span>
                <span>Viento: <span className="font-semibold text-white">{weather.windSpeed} km/h</span></span>
              </div>
            </div>
          )}
        </div>

        <div className="mx-4 md:max-w-5xl md:mx-auto" style={{ borderTop: "2px solid #D7D2CB", marginTop: 46, marginBottom: 46 }} />
        {/* Próximos eventos + Emergencia */}
        <div className="mt-2 md:max-w-5xl md:mx-auto px-4">
          {/* Próximos eventos */}
          <div>
            <p className="text-[#3D2B1F] text-center mb-4" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1 }}>
              Próximos eventos
            </p>
            <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4">
              {upcomingEvents.length === 0 && (
                <p className="text-[#9B9280] text-[13px] text-center py-4 md:col-span-2">No hay eventos próximos.</p>
              )}
              {upcomingEvents.slice(0, 4).map((ev) => (
                <div key={ev.id} className="bg-[#F3ECE4] rounded-2xl overflow-hidden flex shadow-sm" style={{ height: 164 }}>
                  <div className="w-[80px] shrink-0 flex flex-col items-center justify-center py-4" style={{ background: "linear-gradient(180deg, #215732 0%, #47835A 100%)", color: "#FFFBF3" }}>
                    <span className="leading-none" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 40 }}>{ev.day}</span>
                    <span className="leading-none mt-1" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 24 }}>{ev.month}</span>
                    <span className="mt-2" style={{ width: 53, height: 1, backgroundColor: "#86BA86" }} />
                    <span className="mt-1.5 leading-none" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 500, fontSize: 16 }}>{ev.time}</span>
                  </div>
                  <div className="flex-1 px-4 py-3.5 flex flex-col overflow-hidden">
                    <h3 className="leading-snug mb-1" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }}>{ev.title}</h3>
                    <p className="leading-relaxed mb-2 overflow-hidden" style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 16, color: "#54432B", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{ev.description}</p>
                    <div className="flex items-center gap-1.5 mt-auto">
                      <i className="fi-rs-marker shrink-0" style={{ fontSize: 12, color: "#DBA33B" }} />
                      <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontSize: 15, color: "#54432B" }}>{ev.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filete entre eventos y emergencia (Figma) */}
          <div style={{ borderTop: "2px solid #D7D2CB", marginTop: 46, marginBottom: 46 }} />

          {/* Emergencia */}
          <div>
            <div className="bg-[#F3ECE4] rounded-2xl p-6 text-center">
              <h2 className="font-playfair text-[20px] font-bold text-[#54432B] mb-3 underline underline-offset-8" style={{ textDecorationColor: "#DB7C59", textDecorationThickness: 1 }}>
                Emergencia
              </h2>
              <p className="text-[#4A4A4A] text-[13px] leading-relaxed mb-4">
                {ui["Emergencia — intro"] ?? "Si necesitas atención médica inmediata, comunícate con la recepción llamando al:"}
              </p>
              <a href="tel:3500" className="inline-flex items-center gap-2 bg-[#DB7C59] text-[#F3ECE4] font-semibold text-[16px] px-8 py-2.5 rounded-full mb-5 transition-colors hover:bg-[#C96A4B] active:bg-[#AF4E2B]">
                <i className="fi-rs-phone-call" style={{ fontSize: 16 }} />
                {ui["Emergencia — teléfono interno"] ?? "3500"}
              </a>
              <p className="text-[#4A4A4A] text-[13px] leading-relaxed mb-4">
                Si te encuentras fuera del Hotel, llama al:
              </p>
              <a href="tel:+56223223500" className="inline-flex items-center gap-2 bg-[#DB7C59] text-[#F3ECE4] font-semibold text-[16px] px-8 py-2.5 rounded-full transition-colors hover:bg-[#C96A4B] active:bg-[#AF4E2B]">
                <i className="fi-rs-phone-call" style={{ fontSize: 16 }} />
                {ui["Emergencia — teléfono externo"] ?? "+562 2322 3500"}
              </a>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
