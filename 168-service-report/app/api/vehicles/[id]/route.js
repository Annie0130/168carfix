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

export async function PATCH(request, { params }) {
  if (!requireAdmin(cookies())) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const { id } = params;
  const body = await request.json();

  const current = await sql`SELECT status FROM vehicles WHERE id = ${id}`;
  if (current.rows.length === 0) {
    return NextResponse.json({ error: "找不到車輛" }, { status: 404 });
  }

  // 交車完成:把狀態清空,從看板移除
  if (body.clear_status === true) {
    const { rows } = await sql`
      UPDATE vehicles SET status = NULL, status_changed_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return NextResponse.json({ vehicle: rows[0] });
  }

  const statusChanged = !!body.status && body.status !== current.rows[0].status;

  const { rows } = await sql`
    UPDATE vehicles SET
      status = COALESCE(${body.status ?? null}, status),
      status_changed_at = CASE WHEN ${statusChanged} THEN NOW() ELSE status_changed_at END,
      assigned_technician = COALESCE(${body.assigned_technician ?? null}, assigned_technician),
      estimated_completion = COALESCE(${body.estimated_completion ?? null}, estimated_completion),
      same_day_pickup = COALESCE(${body.same_day_pickup ?? null}, same_day_pickup),
      customer_waiting = COALESCE(${body.customer_waiting ?? null}, customer_waiting)
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ vehicle: rows[0] });
}
