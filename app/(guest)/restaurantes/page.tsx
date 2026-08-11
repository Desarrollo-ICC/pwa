"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import { useUiTexts } from "@/components/useUiTexts";

const DEFAULT_RESTAURANTS = [
  { key: "arboleda",  href: "/restaurantes/arboleda",  label: "Arboleda",    desc: "Restaurante principal · Vinos & Fine Dining", defaultImg: "/images/arboleda.jpg" },
  { key: "lagrieta",  href: "/restaurantes/la-grieta", label: "La Grieta",   desc: "Bar & comida informal · Cócteles & Música",   defaultImg: "/images/lagrieta.jpg" },
  { key: "muffin",    href: "/restaurantes/muffin",    label: "Muffin Café", desc: "Cafetería · Pastelería & Bebidas",            defaultImg: "/images/muffin.jpg" },
];

type Card = { key: string; href: string; label: string; desc: string; defaultImg: string };

export default function RestaurantesPage() {
  const uiText = useUiTexts("ui-comer-y-beber");
  const [imgs, setImgs] = useState<Record<string, string>>({});
  const [RESTAURANTS, setRestaurants] = useState<Card[]>(DEFAULT_RESTAURANTS);

  // Tarjetas editables desde el admin (Páginas de Información → ui-comer-y-beber)
  useEffect(() => {
    fetch("/api/info-pages?page=ui-comer-y-beber")
      .then(r => r.json())
      .then(d => {
        const rows = (d.blocks ?? []).filter((b: { block: string }) => b.block === "link");
        if (!rows.length) return;
        setRestaurants(rows.map((b: { title: string; content: string; image: string | null }) => {
          const base = DEFAULT_RESTAURANTS.find(x => x.href === b.content);
          return {
            key: base?.key ?? b.content,
            href: b.content,
            label: b.title,
            desc: base?.desc ?? "",
            defaultImg: b.image ?? base?.defaultImg ?? "/images/arboleda.jpg",
          };
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/familia").then(r => r.json()).then(d => {
      const map: Record<string, string> = {};
      (d.programs ?? []).forEach((p: { type: string; image: string | null }) => {
        const match = p.type.match(/^hero_rest_(.+)$/);
        if (match && p.image) map[match[1]] = p.image;
      });
      setImgs(map);
    });
  }, []);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <div className="pt-16 pb-24 md:pb-12">
        <div className="px-5 py-6 md:max-w-3xl md:mx-auto overflow-hidden">
          <h1 className="font-playfair font-bold text-center mb-6" style={{ fontSize: 40, lineHeight: 1, color: '#54432B' }}>
            {uiText("Título", "Comer y Beber")}
          </h1>
          <div className="flex flex-col items-center md:flex-row md:justify-center md:flex-wrap" style={{ gap: 46 }}>
            {RESTAURANTS.map((r) => (
              <Link key={r.href} href={r.href} className="w-full max-w-[382px]">
                <div className="relative rounded-3xl overflow-hidden shadow-md active:scale-[0.98] transition-transform card-enter w-full" style={{ height: 114 }}>
                  <img src={imgs[r.key] ?? r.defaultImg} alt={r.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h2 className="font-playfair text-white font-bold text-center" style={{ fontSize: 24, lineHeight: 1 }}>{r.label}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
