"use client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useLanguage, type Locale } from "@/components/LanguageProvider";

interface HeaderProps {
  transparent?: boolean;
}

const NAV_ITEMS = [
  { href: "/home",         labelKey: "nav.home",         iconClass: "fi-ts-house-blank" },
  { href: "/habitacion",  labelKey: "nav.room",          iconClass: "fi-ts-bed-alt" },
  { href: "/restaurantes",labelKey: "nav.restaurants",   iconClass: "fi-ts-utensils" },
  { href: "/actividades", labelKey: "nav.activities",    iconClass: "fi-ts-mountain" },
  { href: "/wellness",    labelKey: "nav.wellness",      iconClass: "fi-ts-hot-tub" },
  { href: "/info/mi-estadia",   labelKey: "nav.stay",      iconClass: "fi-ts-family" },
  { href: "/info/emergencias",  labelKey: "nav.emergency", iconClass: "fi-ts-phone-call" },
];

const LANGS: { code: Locale; flag: string; label: string }[] = [
  { code: "es", flag: "cl", label: "ESP" },
  { code: "en", flag: "us", label: "ENG" },
  { code: "pt", flag: "br", label: "POR" },
];

function LangSelector() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGS.find(l => l.code === locale) ?? LANGS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 active:opacity-80"
        aria-label="Cambiar idioma"
      >
        <img
          src={`https://flagcdn.com/w40/${current.flag}.png`}
          alt={current.label}
          className="rounded-full object-cover shrink-0"
          style={{ width: 28, height: 28 }}
        />
        <span className="text-white text-xs font-semibold tracking-wide">{current.label}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-[91] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col p-1 gap-0.5 min-w-[90px]">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                  locale === l.code ? "bg-[#1B4332]/10 text-[#1B4332]" : "text-[#3D2B1F]"
                }`}
              >
                <img
                  src={`https://flagcdn.com/w40/${l.flag}.png`}
                  alt={l.label}
                  className="rounded-full object-cover shrink-0"
                  style={{ width: 22, height: 22 }}
                />
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Header({ transparent = false }: HeaderProps) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const bg = transparent ? "bg-transparent" : "bg-[#1B4332]";

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 w-full z-50 ${bg}`}
        style={{ boxShadow: transparent ? "none" : "0 2px 8px rgba(0,0,0,0.18)" }}
      >
        {/* ── Mobile header (hidden on md+) ── */}
        <div className="flex md:hidden items-center justify-between px-4 py-3 max-w-[480px] mx-auto w-full">
          <Link href="/home">
            <Image src="/images/logo-hotel-termas.svg" alt="Hotel Termas de Chillán" width={160} height={40} className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <LangSelector />
            <button onClick={() => setMenuOpen(true)} className="text-white p-1" aria-label="Abrir menú">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="5" width="18" height="1.8" rx="0.9" fill="white"/>
                <rect x="2" y="10.1" width="18" height="1.8" rx="0.9" fill="white"/>
                <rect x="2" y="15.2" width="18" height="1.8" rx="0.9" fill="white"/>
              </svg>
            </button>
          </div>
        </div>

        {/* ── Desktop header (hidden on mobile) ── */}
        <div className="hidden md:flex items-center justify-between px-8 py-3 max-w-7xl mx-auto w-full">
          <Link href="/home" className="shrink-0">
            <Image src="/images/logo-hotel-termas.svg" alt="Hotel Termas de Chillán" width={180} height={44} className="h-11 w-auto object-contain" />
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/85 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 shrink-0">
            <LangSelector />
          </div>
        </div>
      </header>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#1B4332] flex flex-col rounded-b-3xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
              <Image src="/images/logo-hotel-termas.svg" alt="Hotel Termas de Chillán" width={160} height={40} className="h-10 w-auto object-contain" />
              <button onClick={() => setMenuOpen(false)} className="text-white p-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="4" y1="4" x2="20" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="20" y1="4" x2="4" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <nav>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-5 px-6 py-[18px] border-b border-white/15 active:bg-white/10"
                >
                  <i className={`${item.iconClass} text-white shrink-0`} style={{ fontSize: 22 }} />
                  <span className="text-white font-playfair text-[20px]">{t(item.labelKey)}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}



