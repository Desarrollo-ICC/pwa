import type { Metadata, Viewport } from "next";
import { Poltawski_Nowy } from "next/font/google";
import InstallPrompt from "@/components/InstallPrompt";
import "@fontsource/cooper-hewitt/400.css";
import "@fontsource/cooper-hewitt/600.css";
import "@fontsource/cooper-hewitt/700.css";
import "./globals.css";

const poltawski = Poltawski_Nowy({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Hotel Termas de Chillán",
  description: "Tu guía digital en Hotel Termas de Chillán",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Termas Chillán",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B4332",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Note: admin route overrides this viewport via app/admin/layout.tsx
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={poltawski.variable}>
      <head>
        <link rel="stylesheet" href="/uicons/uicons-thin-straight.css?v=3" />
        <link rel="stylesheet" href="/uicons/uicons-regular-straight.css?v=3" />
        <link rel="stylesheet" href="/uicons/uicons-bold-straight.css?v=3" />
      </head>
      <body className="antialiased">
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
