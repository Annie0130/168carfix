import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request) {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { vehicle_id, report_date, mileage, checklist, summary, technician } =
    await request.json();

  if (!vehicle_id || !checklist) {
    return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
  }

  const { rows } = await sql`
    INSERT INTO reports (vehicle_id, report_date, mileage, checklist, summary, technician)
    VALUES (
      ${vehicle_id},
      ${report_date || new Date().toISOString().slice(0, 10)},
      ${mileage || null},
      ${JSON.stringify(checklist)},
      ${summary || null},
      ${technician || null}
    )
    RETURNING *
  `;

  return NextResponse.json({ report: rows[0] });
}
