"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import VolverButton from "@/components/VolverButton";

const DEFAULT_SECTIONS = [
  {
    href: "/wellness/spa",
    label: "Spa Alunco",
    image: "/images/spa.jpg",
    desc: "Tratamientos, circuitos hidrotermales y yoga",
  },
  {
    href: "/wellness/gimnasio",
    label: "Gimnasio",
    image: "/images/gimnasio.jpg",
    desc: "Clases, fitness y activación corporal",
  },
  {
    href: "/info/piscinas",
    label: "Piscinas",
    image: "/images/spa.jpg",
    desc: "Horarios y reglamento de higiene y seguridad",
  },
];

import { useUiTexts } from "@/components/useUiTexts";

type Section = { href: string; label: string; image: string; desc: string };

export default function WellnessPage() {
  const [sections, setSections] = useState<Section[]>(DEFAULT_SECTIONS);
  const uiText = useUiTexts("ui-bienestar");

  // Tarjetas editables desde el admin (Páginas de Información → ui-bienestar)
  useEffect(() => {
    fetch("/api/info-pages?page=ui-bienestar")
      .then(r => r.json())
      .then(d => {
        const rows = (d.blocks ?? []).filter((b: { block: string }) => b.block === "link");
        if (!rows.length) return;
        setSections(rows.map((b: { title: string; content: string; image: string | null }) => ({
          href: b.content,
          label: b.title,
          image: b.image ?? DEFAULT_SECTIONS.find(x => x.href === b.content)?.image ?? "/images/spa.jpg",
          desc: DEFAULT_SECTIONS.find(x => x.href === b.content)?.desc ?? "",
        })));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <div className="pt-16 page-pb">
        <div className="px-5 py-6">
          <h1 className="font-playfair font-bold text-center mb-6" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>
            {uiText("Título", "Bienestar")}
          </h1>
          <div className="flex flex-col items-center" style={{ gap: 46 }}>
            {sections.map((s) => (
              <Link key={s.href} href={s.href}>
                <div className="relative overflow-hidden shadow-md active:scale-[0.98] transition-transform card-enter" style={{ width: 382, height: 114, borderRadius: 24 }}>
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${s.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="font-playfair text-white font-bold text-center" style={{ fontSize: 24, lineHeight: 1 }}>{s.label}</h2>
                  </div>
                </div>
              </Link>
            ))}
            <VolverButton />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
