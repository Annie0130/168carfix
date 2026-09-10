import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { vehicleCookieName, isValidVehicleSession } from "@/lib/auth";

export async function POST(request, { params }) {
  const { id } = params;

  const reportRes = await sql`SELECT * FROM reports WHERE id = ${id}`;
  if (reportRes.rows.length === 0) {
    return NextResponse.json({ error: "找不到報告" }, { status: 404 });
  }
  const report = reportRes.rows[0];

  const vehicleRes = await sql`SELECT * FROM vehicles WHERE id = ${report.vehicle_id}`;
  const vehicle = vehicleRes.rows[0];

  const cookieValue = cookies().get(vehicleCookieName(vehicle.plate))?.value;
  if (!isValidVehicleSession(vehicle.plate, cookieValue)) {
    return NextResponse.json({ error: "未驗證身份" }, { status: 401 });
  }

  const { rows } = await sql`
    UPDATE reports
    SET customer_approved = TRUE, customer_approved_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ report: rows[0] });
}
