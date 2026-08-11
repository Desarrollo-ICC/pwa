"use client";
import { useEffect, useRef, useState } from "react";

// Imagen de hero con aparición suave: mantiene el fondo verde del contenedor
// y hace fade-in cuando la imagen terminó de cargar (evita el parpadeo al navegar).
export default function HeroImage({ src, alt }: { src: string | null; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Si la imagen ya estaba en caché, `load` puede dispararse antes de que React
  // enganche onLoad — comprobar `complete` evita que quede invisible.
  useEffect(() => {
    setLoaded(ref.current?.complete ?? false);
  }, [src]);

  if (!src) return null;
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-200"
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
}
