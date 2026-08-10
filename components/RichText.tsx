"use client";
import React from "react";

// Renderizado de texto de contenido (feedback DSÑ 06-08):
// - **texto** → negrita
// - líneas que empiezan con "- " → viñetas
// - líneas que empiezan con "1. " → lista numerada
// - resto → párrafos (respeta líneas en blanco)

function inline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith("**") && p.endsWith("**")
      ? <strong key={i} className="font-bold text-[#3D2B1F]">{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

export default function RichText({ text, className }: { text: string; className?: string }) {
  const lines = (text ?? "").split("\n");
  const out: React.ReactNode[] = [];
  let i = 0, key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*-\s+/, ""));
      out.push(
        <ul key={key++} className="flex flex-col gap-1.5 my-1.5">
          {items.map((it, j) => (
            <li key={j} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1B4332]/40 shrink-0 mt-[7px]" />
              <span>{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      out.push(
        <ol key={key++} className="flex flex-col gap-1 my-1.5" style={{ listStyle: "decimal inside" }}>
          {items.map((it, j) => <li key={j}>{inline(it)}</li>)}
        </ol>
      );
      continue;
    }

    if (line.trim() === "") { out.push(<div key={key++} className="h-2" />); i++; continue; }

    out.push(<p key={key++}>{inline(line)}</p>);
    i++;
  }

  return (
    <div className={className ?? "text-[#3D2B1F] text-[14px] leading-relaxed"} style={{ fontFamily: "'Cooper Hewitt', sans-serif" }}>
      {out}
    </div>
  );
}
