"use client";
import { useEffect, useState } from "react";

// Textos de interfaz editables desde el admin (Páginas de Información → ui-*).
// Cada bloque de la página ui-<slug> se indexa por su título; si no existe, se usa el fallback.
export function useUiTexts(page: string) {
  const [ui, setUi] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(`/api/info-pages?page=${encodeURIComponent(page)}`)
      .then(r => r.json())
      .then(d => {
        const m: Record<string, string> = {};
        for (const b of d.blocks ?? []) if (b.title) m[b.title] = b.content ?? "";
        setUi(m);
      })
      .catch(() => {});
  }, [page]);

  return (key: string, fallback: string) => {
    const v = ui[key];
    return v !== undefined && v !== "" ? v : fallback;
  };
}
