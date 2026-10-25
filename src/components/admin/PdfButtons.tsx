"use client";
import { useState } from "react";

/** Скачивание PDF-отчёта об ученике: язык выбирается перед генерацией. */
export function PdfButtons({ studentId }: { studentId: string | null }) {
  const [lang, setLang] = useState<"ru" | "kk">("ru");
  const href = (notes: boolean) => `/api/admin/students/${studentId}/report?lang=${lang}${notes ? "&notes=1" : ""}`;
  return (
    <>
      <div className="row" style={{ margin: "12px 0 0" }}>
        <label htmlFor="pdflang" style={{ margin: 0 }}>Язык PDF:</label>
        <select id="pdflang" value={lang} onChange={(e) => setLang(e.target.value as "ru" | "kk")} aria-label="Язык PDF-отчёта">
          <option value="ru">Русский</option>
          <option value="kk">Қазақша</option>
        </select>
      </div>
      <div className="row" style={{ margin: "8px 0 0" }}>
        {studentId ? (
          <>
            <a className="pdf" href={href(false)} download>📄 PDF-отчёт</a>
            <a className="pdf" href={href(true)} download>📄 PDF с заметками</a>
          </>
        ) : (
          <>
            <button disabled>📄 PDF-отчёт</button>
            <button disabled>📄 PDF с заметками</button>
          </>
        )}
      </div>
    </>
  );
}
