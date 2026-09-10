import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import NewReportForm from "./NewReportForm";
import StatusPanel from "./StatusPanel";

export const dynamic = "force-dynamic";

export default async function VehicleDetailPage({ params }) {
  if (!requireAdmin(cookies())) {
    redirect("/admin/login");
  }

  const vehicleRes = await sql`SELECT * FROM vehicles WHERE id = ${params.id}`;
  if (vehicleRes.rows.length === 0) notFound();
  const vehicle = vehicleRes.rows[0];

  const reportsRes = await sql`
    SELECT * FROM reports WHERE vehicle_id = ${params.id}
    ORDER BY report_date DESC, created_at DESC
  `;

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <Link href="/admin/dashboard" className="text-sm text-steel hover:underline">
        ← 回車輛總覽
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8">
        <div>
          <p className="font-mono-data text-xs tracking-wide text-steel mb-1">
            {vehicle.car_model || "未填車型"}
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink font-mono-data">
            {vehicle.plate}
          </h1>
          <p className="text-sm text-ink/60 mt-1">
            {vehicle.owner_name || "—"} · {vehicle.phone}
          </p>
        </div>

        <div className="text-center">
          <img
            src={`/api/qrcode/${encodeURIComponent(vehicle.plate)}`}
            alt="QR Code"
            className="w-28 h-28 border border-line rounded-sm bg-white p-1"
          />
          <a
            href={`/api/qrcode/${encodeURIComponent(vehicle.plate)}?download=1`}
            className="block text-xs text-steel hover:underline mt-1"
          >
            下載 QR Code
          </a>
        </div>
      </div>

      <div className="mb-8">
        <StatusPanel vehicle={vehicle} />
      </div>

      <NewReportForm vehicleId={vehicle.id} />

      <h2 className="font-display text-xl text-ink mt-10 mb-3">
        歷史報告 ({reportsRes.rows.length})
      </h2>

      {reportsRes.rows.length === 0 && (
        <p className="text-ink/50 text-sm">尚無報告紀錄。</p>
      )}

      <ul className="space-y-2">
        {reportsRes.rows.map((r) => (
          <li key={r.id}>
            <Link
              href={`/report/${r.id}`}
              target="_blank"
              className="flex items-center justify-between border border-line bg-white rounded-sm px-4 py-3 hover:border-steel transition-colors"
            >
              <span className="font-mono-data text-ink">
                {String(r.report_date).slice(0, 10)}
              </span>
              <span className="text-sm text-ink/50">
                {r.technician ? `技師: ${r.technician}` : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
