"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

// Feedback DSÑ 06-08: se prescinde de la botonera inferior.
// En su lugar, botón sticky "Subir" (Figma: componente "Volver Arriba") presente en toda la PWA.
export default function BottomNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrolled = () =>
      Math.max(window.scrollY, document.documentElement.scrollTop || 0, document.body.scrollTop || 0);
    const onScroll = () => setVisible(scrolled() > 250);
    onScroll();
    // captura: también detecta scroll de contenedores internos
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!visible || !mounted) return null;

  // Portal a <body>: la animación page-transition retiene un transform que
  // convierte a los ancestros en containing block y rompe position:fixed.
  return createPortal(
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTo?.({ top: 0, behavior: "smooth" });
        document.body.scrollTo?.({ top: 0, behavior: "smooth" });
      }}
      aria-label="Volver arriba"
      className="fixed z-40 flex items-center justify-center rounded-full shadow-md active:opacity-80"
      style={{
        right: 16,
        bottom: "max(20px, env(safe-area-inset-bottom))",
        width: 32,
        height: 32,
        backgroundColor: "#1B4332",
        border: "1px solid rgba(255,255,255,0.25)",
      }}
    >
      <i className="fi-rs-angle-up text-white" style={{ fontSize: 13, lineHeight: 1 }} />
    </button>,
    document.body
  );
}
