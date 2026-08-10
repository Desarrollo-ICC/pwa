"use client";
import { useEffect, useState } from "react";

// Imagen de hero con aparición suave: mantiene el fondo verde del contenedor
// y hace fade-in cuando la imagen terminó de cargar (evita el parpadeo al navegar).
export default function HeroImage({ src, alt }: { src: string | null; alt: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => setLoaded(false), [src]);

  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
      style={{ opacity: loaded ? 1 : 0 }}
    />
  );
}
