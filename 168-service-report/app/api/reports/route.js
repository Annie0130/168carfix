import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(request) {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const {
    vehicle_id,
    report_date,
    mileage,
    checklist,
    quantified,
    summary,
    technician,
    parts,
    advisory_items,
    next_service_mileage,
    next_service_date,
  } = await request.json();

  if (!vehicle_id || !checklist) {
    return NextResponse.json({ error: "缺少必要欄位" }, { status: 400 });
  }

  const { rows } = await sql`
    INSERT INTO reports (
      vehicle_id, report_date, mileage, checklist, quantified, summary, technician,
      parts, advisory_items, next_service_mileage, next_service_date
    )
    VALUES (
      ${vehicle_id},
      ${report_date || new Date().toISOString().slice(0, 10)},
      ${mileage || null},
      ${JSON.stringify(checklist)},
      ${JSON.stringify(quantified || {})},
      ${summary || null},
      ${technician || null},
      ${JSON.stringify(parts || [])},
      ${JSON.stringify(advisory_items || [])},
      ${next_service_mileage || null},
      ${next_service_date || null}
    )
    RETURNING *
  `;

  return NextResponse.json({ report: rows[0] });
}
