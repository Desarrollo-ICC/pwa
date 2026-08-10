"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

interface GymClass { id: number; name: string; description: string | null; price: string | null; schedule: string | null; }

export default function GimnasioPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [heroImg, setHeroImg] = useState("/images/gimnasio.jpg");

  useEffect(() => {
    fetch("/api/gym/classes").then(r => r.json()).then(d => setClasses(d.classes ?? []));
    fetch("/api/familia").then(r => r.json()).then(d => {
      const hero = (d.programs ?? []).find((p: { type: string; image: string | null }) => p.type === "hero_gimnasio");
      if (hero?.image) setHeroImg(hero.image);
    });
  }, []);

  return (
    <div className="min-h-svh bg-[#FFFBF3]">
      <Header />
      <div>
        <div className="relative overflow-hidden shadow-lg" style={{ height: 378, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 }}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImg}')` }} />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-playfair text-white font-bold text-center drop-shadow-lg" style={{ fontSize: 40, lineHeight: 1 }}>Gimnasio</h1>
          </div>
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <button onClick={() => router.back()} className="bg-[#1B4332] text-white text-[15px] font-medium px-6 py-1 rounded-full active:opacity-80"><i className="fi-rs-angle-left" style={{ fontSize: 11, marginRight: 6 }} />Volver</button>
          </div>
        </div>

        <div className="px-4 py-5 pb-24 md:pb-12 flex flex-col gap-4 md:max-w-3xl md:mx-auto">
          {/* Hours */}
          <div className="bg-[#F3EDE4] rounded-2xl p-4 border border-[#EDE6D8]">
            <p style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: "#54432B" }} className="mb-1">Horarios de Atención:</p>
            <p className="text-[13px] text-[#3D2B1F]">Horario Continuo</p>
          </div>

          {/* Classes */}
          <h2 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 32, lineHeight: 1, color: "#54432B", textAlign: "center" }}>Fitness y Clases</h2>
          {classes.length > 0 ? (
            classes.map(c => (
              <div key={c.id} className="bg-[#F3EDE4] rounded-2xl p-4 border border-[#EDE6D8] shadow-sm">
                <h3 style={{ fontFamily: "'Poltawski Nowy', Georgia, serif", fontWeight: 700, fontSize: 20, lineHeight: 1, color: "#54432B" }} className="mb-1">{c.name}</h3>
                {c.description && <p className="text-[#6B6B6B] text-[13px] leading-relaxed mb-2">{c.description}</p>}
                <div className="flex items-center gap-4">
                  {c.schedule && (
                    <div className="flex items-center gap-1.5">
                    <i className="fi-rs-clock-three" style={{ fontSize: 13, color: "#DBA33B" }} />
                      <span className="text-[12px] font-medium text-[#54432B]">{c.schedule}</span>
                    </div>
                  )}
                  {c.price && (
                    <div className="flex items-center gap-1.5">
                    <i className="fi-rs-usd-circle" style={{ fontSize: 13, color: "#DBA33B" }} />
                      <span style={{ fontFamily: "'Cooper Hewitt', sans-serif", fontWeight: 400, fontSize: 15, lineHeight: 1, color: "#54432B" }}>{c.price}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[#9B9280] text-center py-6 text-[14px]">Cargando clases...</p>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
