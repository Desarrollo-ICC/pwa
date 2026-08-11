"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";
import HeroImage from "@/components/HeroImage";
import { useUiTexts } from "@/components/useUiTexts";
import { ChevronRight } from "lucide-react";

interface Schedule { venue: string; hours: string; }

// Submenú del Spa (Figma: PWA- Spa Alunco SubMenú)
const DEFAULT_LINKS = [
  { href: "/wellness/spa/tratamientos", label: "Menú de Tratamientos" },
  { href: "/info/circuitos-hidrotermales", label: "Circuitos Hidrotermales" },
  { href: "/info/sala-yoga", label: "Sala de Yoga y Meditación" },
];

const VENUE_LABEL: Record<string, string> = {
  spa: "Spa",
  tratamientos: "Tratamientos",
  peluqueria: "Peluquería",
};

export default function SpaPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const uiText = useUiTexts("ui-spa");
  const [heroImg, setHeroImg] = useState<string | null>(null);
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [nota, setNota] = useState("Para agendar, llama al 3544 desde tu habitación o acércate a la recepción del Spa.");

  useEffect(() => {
    fetch("/api/spa/schedules").then(r => r.json()).then(d => setSchedules(d.schedules ?? []));
    // Accesos y nota editables desde el admin (ui-spa-submenu)
    fetch("/api/info-pages?page=ui-spa-submenu")
      .then(r => r.json())
      .then(d => {
        const rows = (d.blocks ?? []);
        const ls = rows.filter((b: { block: string }) => b.block === "link");
        if (ls.length) setLinks(ls.map((b: { title: string; content: string }) => ({ href: b.content, label: b.title })));
        const n = rows.find((b: { title: string }) => b.title === "Nota agendar");
        if (n?.content) setNota(n.content);
      })
      .catch(() => {});
    fetch("/api/familia").then(r => r.json()).then(d => {
      const hero = (d.programs ?? []).find((p: { type: string; image: string | null }) => p.type === "hero_spa");
      setHeroImg(hero?.image ?? "/images/spa.jpg");
    }).catch(() => setHeroImg("/images/spa.jpg"));
  }, []);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">

      {/* Hero */}
      <div className="relative overflow-hidden shadow-lg bg-[#22382D]" style={{ height: 293, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
        <HeroImage src={heroImg} alt="Spa Alunco" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white font-bold text-center drop-shadow-lg" style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontSize: 40, lineHeight: 1 }}>{uiText("Título", "Spa Alunco")}</h1>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <VolverButton />
        </div>
      </div>

      <div className="px-5 py-6 pb-24 md:pb-12 md:max-w-3xl md:mx-auto">
        {/* Horarios de Atención */}
        {schedules.length > 0 && (
          <div className="mb-5">
            <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, color: "#54432B" }} className="mb-2">
              {uiText("Título horarios", "Horarios de Atención:")}
            </h2>
            {schedules.map((s, i) => (
              <p key={`${s.venue}-${i}`} className="text-[14px] text-[#3D2B1F] leading-relaxed">
                <span className="font-bold">{VENUE_LABEL[s.venue] ?? s.venue}:</span> {s.hours}
              </p>
            ))}
            <div className="border-t border-[#E8DDD0] mt-3 pt-3 flex items-start gap-2">
              <i className="fi-rs-calendar text-[#C8963E] mt-0.5 shrink-0" style={{ fontSize: 14 }} />
              <p className="text-[12px] text-[#7B6354]">
                {nota}
              </p>
            </div>
          </div>
        )}

        {/* Accesos */}
        <div className="flex flex-col gap-3">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="flex justify-between items-center px-4 py-4 rounded-2xl bg-[#F3ECE4] border border-[#EDE6D8] shadow-sm active:opacity-80"
            >
              <span style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 18, color: "#54432B" }}>{l.label}</span>
              <ChevronRight size={18} className="text-[#9B9280] shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
