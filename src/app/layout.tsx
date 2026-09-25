import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Подготовка в БИЛ",
  description: "Подготовка к поступлению: математика и логика",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
