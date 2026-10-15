import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/client";
import { getLang } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Подготовка в БИЛ",
  description: "Подготовка к поступлению: математика и логика",
};

// Выставляет тему до первой отрисовки, чтобы не было вспышки при тёмной теме.
const themeInit = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html lang={lang === "kk" ? "kk" : "ru"} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body><LangProvider lang={lang}>{children}</LangProvider></body>
    </html>
  );
}
