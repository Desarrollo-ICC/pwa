"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { LayoutDashboard, Sparkles, UtensilsCrossed, Mountain, Baby, BedDouble, Bell, Users, LogOut, Activity, Menu, X, CalendarDays, Settings, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, module: null, superadminOnly: false },
  { href: "/admin/alertas", label: "Alertas", icon: Bell, module: null, superadminOnly: false },
  { href: "/admin/eventos", label: "Eventos", icon: CalendarDays, module: null, superadminOnly: true },
  { href: "/admin/spa", label: "Spa & Gimnasio", icon: Sparkles, module: "spa", superadminOnly: false },
  { href: "/admin/restaurantes", label: "Restaurantes", icon: UtensilsCrossed, module: "restaurantes", superadminOnly: false },
  { href: "/admin/actividades", label: "Actividades", icon: Mountain, module: "actividades", superadminOnly: false },
  { href: "/admin/familia", label: "Familia y Niños", icon: Baby, module: "familia", superadminOnly: false },
  { href: "/admin/habitacion", label: "Mi Habitación", icon: BedDouble, module: "habitacion", superadminOnly: false },
  { href: "/admin/info-pages", label: "Páginas de Información", icon: FileText, module: null, superadminOnly: false },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users, module: null, superadminOnly: false },
  { href: "/admin/logs", label: "Registro de Actividad", icon: Activity, module: null, superadminOnly: true },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings, module: null, superadminOnly: true },
];

function SidebarContent({ visibleNav, pathname, session, role, userModule, onNavClick }: {
  visibleNav: typeof NAV;
  pathname: string;
  session: { user?: { name?: string | null } } | null;
  role: string | undefined;
  userModule: string | undefined;
  onNavClick?: () => void;
}) {
  return (
    <>
      <div className="py-6 px-4 border-b border-white/10 flex items-center justify-center">
        <Image src="/images/logo-hotel-termas.svg" alt="Hotel Termas de Chillán" width={160} height={40} className="h-10 w-auto object-contain" />
      </div>
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {visibleNav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${pathname === item.href ? "bg-white text-[#1B4332]" : "text-white/80 hover:bg-white/10"}`}
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <p className="text-white/60 text-[11px] mb-1 truncate">{session?.user?.name}</p>
        <p className="text-white/40 text-[10px] mb-3">{role === "superadmin" ? "Super Admin" : `Admin · ${userModule}`}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-white/60 hover:text-white text-[12px] transition-colors"
        >
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const userModule = (session?.user as { module?: string })?.module;
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const visibleNav = NAV.filter(item => {
    if (role === "superadmin") return true;
    if (item.superadminOnly) return false;
    if (item.module === null && item.href !== "/admin/usuarios") return item.href === "/admin";
    return item.module === userModule;
  });

  const sidebarProps = { visibleNav, pathname, session, role, userModule };

  return (
    <div className="admin-shell flex min-h-svh bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-[#1B4332] flex-col shrink-0 sticky top-0 h-svh">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#1B4332] flex flex-col transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="absolute top-3 right-3">
          <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <SidebarContent {...sidebarProps} onNavClick={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[#1B4332] p-1 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
          <span className="font-bold text-[#1B4332] text-[14px] tracking-wide uppercase">Hotel Termas</span>
          <span className="ml-auto text-gray-400 text-[11px]">{role === "superadmin" ? "Super Admin" : `Admin · ${userModule}`}</span>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
