import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { vehicleCookieName, makeVehicleSessionValue } from "@/lib/auth";

export async function POST(request) {
  const { plate, phoneLast4 } = await request.json();

  if (!plate || !phoneLast4 || phoneLast4.length !== 4) {
    return NextResponse.json({ error: "請輸入手機末四碼" }, { status: 400 });
  }

  const { rows } = await sql`
    SELECT * FROM vehicles WHERE plate = ${plate.toUpperCase().trim()}
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "查無此車輛" }, { status: 404 });
  }

  const vehicle = rows[0];
  const actualLast4 = vehicle.phone.replace(/\D/g, "").slice(-4);

  if (actualLast4 !== phoneLast4) {
    return NextResponse.json({ error: "手機末四碼不正確" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true, vehicle });
  res.cookies.set(vehicleCookieName(vehicle.plate), makeVehicleSessionValue(vehicle.plate), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 180, // 半年,貼在車上長期都能看
  });
  return res;
}
