import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const { rows } = await sql`
    SELECT v.*, 
      (SELECT COUNT(*) FROM reports r WHERE r.vehicle_id = v.id) AS report_count
    FROM vehicles v
    ORDER BY v.created_at DESC
  `;
  return NextResponse.json({ vehicles: rows });
}

export async function POST(request) {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const { plate, phone, owner_name, car_model } = await request.json();

  if (!plate || !phone) {
    return NextResponse.json({ error: "車牌與電話為必填" }, { status: 400 });
  }

  try {
    const { rows } = await sql`
      INSERT INTO vehicles (plate, phone, owner_name, car_model)
      VALUES (${plate.toUpperCase().trim()}, ${phone.trim()}, ${owner_name || null}, ${car_model || null})
      RETURNING *
    `;
    return NextResponse.json({ vehicle: rows[0] });
  } catch (err) {
    if (String(err).includes("duplicate key")) {
      return NextResponse.json({ error: "這個車牌已經建立過了" }, { status: 409 });
    }
    return NextResponse.json({ error: "建立失敗,請稍後再試" }, { status: 500 });
  }
}
