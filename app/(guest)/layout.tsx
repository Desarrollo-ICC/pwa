import { GuestProvider } from "@/components/GuestProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/Header";

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <GuestProvider>
        {/* Header en el layout: permanece estable durante la transición de páginas */}
        <Header />
        <PageTransition>{children}</PageTransition>
      </GuestProvider>
    </LanguageProvider>
  );
}
