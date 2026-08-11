"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Texto editable desde el admin (Páginas de Información → ui-global, bloque "Volver").
// Caché de módulo: se consulta una sola vez por sesión.
let volverCache: string | null = null;

// Botón "Volver" (Figma: componente "Botón Volver", 117×32,
// gradiente #215732 → #47835A → #215732, texto Cooper Hewitt Medium 20 #FFFBF3)
export default function VolverButton({ white = false, className, onClick }: { white?: boolean; className?: string; onClick?: () => void }) {
  const router = useRouter();
  const [label, setLabel] = useState(volverCache ?? "Volver");

  useEffect(() => {
    if (volverCache !== null) return;
    fetch("/api/info-pages?page=ui-global")
      .then(r => r.json())
      .then(d => {
        const b = (d.blocks ?? []).find((x: { title: string | null }) => x.title === "Volver");
        const v = b?.content || "Volver";
        volverCache = v;
        setLabel(v);
      })
      .catch(() => {});
  }, []);

  return (
    <button
      onClick={onClick ?? (() => router.back())}
      className={`inline-flex items-center justify-center rounded-full active:opacity-80 ${className ?? ""}`}
      style={{
        height: 32,
        minWidth: 117,
        paddingLeft: 18,
        paddingRight: 18,
        background: white ? "#FFFFFF" : "linear-gradient(90deg, #215732 0%, #47835A 50%, #215732 100%)",
        color: white ? "#DB7C59" : "#FFFBF3",
        fontFamily: "'Cooper Hewitt', sans-serif",
        fontWeight: 500,
        fontSize: 20,
        lineHeight: 1,
      }}
    >
      <i className="fi-rs-angle-left" style={{ fontSize: 12, marginRight: 8 }} />
      {label}
    </button>
  );
}
