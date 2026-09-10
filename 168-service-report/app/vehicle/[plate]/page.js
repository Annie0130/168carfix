import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { vehicleCookieName, isValidVehicleSession } from "@/lib/auth";
import VerifyForm from "./VerifyForm";

export const dynamic = "force-dynamic";

export default async function VehiclePage({ params }) {
  const plate = decodeURIComponent(params.plate).toUpperCase();

  const vehicleRes = await sql`SELECT * FROM vehicles WHERE plate = ${plate}`;
  if (vehicleRes.rows.length === 0) notFound();
  const vehicle = vehicleRes.rows[0];

  const cookieValue = cookies().get(vehicleCookieName(plate))?.value;
  const verified = isValidVehicleSession(plate, cookieValue);

  if (!verified) {
    return <VerifyForm plate={plate} />;
  }

  const reportsRes = await sql`
    SELECT * FROM reports WHERE vehicle_id = ${vehicle.id}
    ORDER BY report_date DESC, created_at DESC
  `;

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <p className="font-mono-data text-xs tracking-wide text-steel mb-1">
        168 汽車維修中心
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink font-mono-data mb-1">
        {vehicle.plate}
      </h1>
      <p className="text-sm text-ink/60 mb-8">
        {vehicle.owner_name || "—"} · {vehicle.car_model || "未填車型"}
      </p>

      <h2 className="font-display text-xl text-ink mb-4">車輛維修履歷</h2>

      {reportsRes.rows.length === 0 && (
        <p className="text-ink/50 text-sm">目前還沒有任何檢測報告。</p>
      )}

      <ol className="relative border-l border-line ml-2">
        {reportsRes.rows.map((r) => {
          const hasUrgent = (r.checklist || []).some((c) => c.status === "需立即更換");
          const partsNames = (r.parts || []).map((p) => p.name);
          return (
            <li key={r.id} className="mb-6 ml-5">
              <span
                className={`absolute -left-[7px] mt-1.5 w-3 h-3 rounded-full border-2 border-white ${
                  hasUrgent ? "bg-red-500" : "bg-steel"
                }`}
              />
              <Link
                href={`/report/${r.id}`}
                className="block border border-line bg-white rounded-sm px-4 py-3 hover:border-steel transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono-data text-ink font-medium">
                    {String(r.report_date).slice(0, 10)}
                  </span>
                  <span className="text-sm text-steel">查看報告 →</span>
                </div>
                {r.mileage && (
                  <p className="text-xs text-ink/50 mb-1.5">{r.mileage.toLocaleString()} km</p>
                )}
                {partsNames.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {partsNames.map((name, i) => (
                      <span key={i} className="text-xs bg-paper border border-line rounded-full px-2 py-0.5 text-ink/60">
                        {name}
                      </span>
                    ))}
                  </div>
                )}
                {hasUrgent && (
                  <p className="text-xs text-red-600 mt-1.5">⚠ 有項目建議立即處理</p>
                )}
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
