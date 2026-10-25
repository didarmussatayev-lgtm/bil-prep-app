"use client";
import { useEffect, useState } from "react";

export type BookInfo = { key: string; title: string };

export function useBooks() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  useEffect(() => { fetch("/api/admin/books").then((r) => r.json()).then(setBooks).catch(() => {}); }, []);
  return books;
}

/** Чекбоксы «книг». Крупные зоны нажатия — админкой пользуются с телефона. */
export function BookPicker({ books, value, onChange, disabled }: {
  books: BookInfo[]; value: string[]; onChange: (v: string[]) => void; disabled?: boolean;
}) {
  const toggle = (k: string) => onChange(value.includes(k) ? value.filter((x) => x !== k) : [...value, k]);
  return (
    <div className="books">
      {books.map((b) => (
        <label key={b.key} className={`chip ${value.includes(b.key) ? "on" : ""}`}>
          <input type="checkbox" checked={value.includes(b.key)} disabled={disabled} onChange={() => toggle(b.key)} />
          {b.title}
        </label>
      ))}
    </div>
  );
}
