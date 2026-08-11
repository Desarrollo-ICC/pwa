// Shared config for the restaurant routes (slug ↔ DB key ↔ display).
export const RESTAURANTS: Record<string, { apiKey: string; label: string; image: string; menuHeading: string }> = {
  "arboleda":  { apiKey: "arboleda", label: "Arboleda",    image: "/images/arboleda.jpg",  menuHeading: "Bebidas" },
  "la-grieta": { apiKey: "lagrieta", label: "La Grieta",   image: "/images/lagrieta.jpg",  menuHeading: "Menús" },
  "muffin":    { apiKey: "muffin",   label: "Muffin Café", image: "/images/muffin.jpg",    menuHeading: "Menús" },
};

export function slugifyCat(cat: string) {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
