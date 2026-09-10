import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request, { params }) {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const { id } = params;

  const vehicleRes = await sql`SELECT * FROM vehicles WHERE id = ${id}`;
  if (vehicleRes.rows.length === 0) {
    return NextResponse.json({ error: "找不到車輛" }, { status: 404 });
  }
  const reportsRes = await sql`
    SELECT * FROM reports WHERE vehicle_id = ${id} ORDER BY report_date DESC, created_at DESC
  `;

  return NextResponse.json({
    vehicle: vehicleRes.rows[0],
    reports: reportsRes.rows,
  });
}
