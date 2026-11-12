import type { Metadata, Viewport } from "next";
import "./globals.css";
import "katex/dist/katex.min.css";
import { LangProvider } from "@/lib/i18n/client";
import { RegisterSW } from "@/components/RegisterSW";
import { getLang } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Подготовка в БИЛ",
  description: "Подготовка к поступлению: математика и логика",
  applicationName: "ALMATH",
  icons: { icon: "/icons/favicon-48.png", apple: "/icons/apple-touch-icon.png" },
  appleWebApp: { capable: true, title: "ALMATH", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#58cc02" };

// Выставляет тему до первой отрисовки, чтобы не было вспышки при тёмной теме.
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang === "kk" ? "kk" : "ru"} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700;800&display=swap&subset=cyrillic" />
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body><LangProvider lang={lang}>{children}</LangProvider><RegisterSW /></body>
    </html>
  );
}
