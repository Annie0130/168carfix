import { NextResponse } from "next/server";
import { checkAdminPassword, makeAdminSessionValue, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(request) {
  const { username, password } = await request.json();

  if (!checkAdminPassword(username, password)) {
    return NextResponse.json(
      { error: "帳號或密碼錯誤" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeAdminSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 天
  });
  return res;
}
