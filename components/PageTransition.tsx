"use client";
import { usePathname } from "next/navigation";

// Transición suave entre secciones: solo el contenido (el Header vive en el layout
// y permanece estable). Fade + deriva sutil de 6px, 250ms.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
