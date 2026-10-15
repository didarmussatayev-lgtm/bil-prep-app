import { NextResponse } from "next/server";
import { LANG_COOKIE, normLang } from "@/lib/i18n/config";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const res = NextResponse.json({ lang: normLang(body?.lang) });
  res.cookies.set(LANG_COOKIE, normLang(body?.lang), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  return res;
}
