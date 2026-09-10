import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const { rows } = await sql`
    SELECT id, plate, phone, owner_name, car_model, status, status_changed_at,
           assigned_technician, estimated_completion, same_day_pickup, customer_waiting
    FROM vehicles
    WHERE status IS NOT NULL
    ORDER BY status_changed_at ASC
  `;
  return NextResponse.json({ vehicles: rows });
}
