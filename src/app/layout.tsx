import type { Metadata, Viewport } from "next";
import "./globals.css";
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

export const viewport: Viewport = { themeColor: "#3b5bfa" };

// Выставляет тему до первой отрисовки, чтобы не было вспышки при тёмной теме.
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang === "kk" ? "kk" : "ru"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body><LangProvider lang={lang}>{children}</LangProvider><RegisterSW /></body>
    </html>
  );
}
