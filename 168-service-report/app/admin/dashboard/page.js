import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import AddVehicleForm from "./AddVehicleForm";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!requireAdmin(cookies())) {
    redirect("/admin/login");
  }

  const { rows: vehicles } = await sql`
    SELECT v.*, 
      (SELECT COUNT(*) FROM reports r WHERE r.vehicle_id = v.id) AS report_count,
      (SELECT MAX(report_date) FROM reports r WHERE r.vehicle_id = v.id) AS last_report_date
    FROM vehicles v
    ORDER BY v.created_at DESC
  `;

  return (
    <main className="min-h-screen px-6 py-10 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono-data text-xs tracking-wide text-steel mb-1">
            168 汽車維修中心
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">
            車輛總覽
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/board"
            className="bg-ink text-paper px-4 py-2 rounded-sm hover:bg-steel transition-colors text-sm font-mono-data"
          >
            廠內即時看板 →
          </Link>
          <LogoutButton />
        </div>
      </div>

      <AddVehicleForm />

      <h2 className="font-display text-xl text-ink mt-10 mb-3">
        已建立車輛 ({vehicles.length})
      </h2>

      {vehicles.length === 0 && (
        <p className="text-ink/50 text-sm">還沒有車輛資料,先用上方表單新增一台。</p>
      )}

      <ul className="space-y-2">
        {vehicles.map((v) => (
          <li key={v.id}>
            <Link
              href={`/admin/vehicles/${v.id}`}
              className="flex items-center justify-between border border-line bg-white rounded-sm px-4 py-3 hover:border-steel transition-colors"
            >
              <div>
                <p className="font-mono-data font-medium text-ink">{v.plate}</p>
                <p className="text-sm text-ink/60">
                  {v.owner_name || "—"} · {v.car_model || "未填車型"}
                </p>
              </div>
              <div className="text-right text-sm text-ink/50">
                <p>{v.report_count} 筆報告</p>
                <p>{v.last_report_date ? String(v.last_report_date).slice(0, 10) : "尚無報告"}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
