import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { requireAdmin, vehicleCookieName, isValidVehicleSession } from "@/lib/auth";
import { STATUS_STYLE } from "@/lib/checklist";
import PrintButton from "./PrintButton";
import VerifyForm from "../../vehicle/[plate]/VerifyForm";

export const dynamic = "force-dynamic";

export default async function ReportPage({ params }) {
  const reportRes = await sql`SELECT * FROM reports WHERE id = ${params.id}`;
  if (reportRes.rows.length === 0) notFound();
  const report = reportRes.rows[0];

  const vehicleRes = await sql`SELECT * FROM vehicles WHERE id = ${report.vehicle_id}`;
  if (vehicleRes.rows.length === 0) notFound();
  const vehicle = vehicleRes.rows[0];

  const isAdmin = requireAdmin(cookies());
  const vehicleCookie = cookies().get(vehicleCookieName(vehicle.plate))?.value;
  const isVehicleOwner = isValidVehicleSession(vehicle.plate, vehicleCookie);

  if (!isAdmin && !isVehicleOwner) {
    return <VerifyForm plate={vehicle.plate} />;
  }

  const checklist = report.checklist || [];

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto flex justify-end mb-4 no-print">
        <PrintButton />
      </div>

      <div className="print-sheet max-w-2xl mx-auto bg-white border border-line rounded-sm p-8 md:p-10">
        <header className="flex items-start justify-between border-b border-line pb-6 mb-6">
          <div>
            <p className="font-mono-data text-xs tracking-wide text-steel mb-1">
              車輛檢測報告
            </p>
            <h1 className="font-display text-2xl font-semibold text-ink">
              168 汽車維修中心
            </h1>
            <p className="text-xs text-ink/50 mt-1">
              新北市五股區登林路91-7號 · 0908-109057
            </p>
          </div>
          <div className="text-right font-mono-data text-sm text-ink/70">
            <p>{String(report.report_date).slice(0, 10)}</p>
            {report.mileage && <p>{report.mileage.toLocaleString()} km</p>}
          </div>
        </header>

        <section className="grid grid-cols-2 gap-4 mb-8 text-sm">
          <div>
            <p className="text-ink/40 mb-0.5">車牌</p>
            <p className="font-mono-data text-ink font-medium">{vehicle.plate}</p>
          </div>
          <div>
            <p className="text-ink/40 mb-0.5">車型</p>
            <p className="text-ink">{vehicle.car_model || "—"}</p>
          </div>
          <div>
            <p className="text-ink/40 mb-0.5">車主</p>
            <p className="text-ink">{vehicle.owner_name || "—"}</p>
          </div>
          <div>
            <p className="text-ink/40 mb-0.5">技師 / 店員</p>
            <p className="text-ink">{report.technician || "—"}</p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-display text-lg text-ink mb-3">檢測項目</h2>
          <table className="w-full text-sm border-t border-line">
            <tbody>
              {checklist.map((row, i) => (
                <tr key={i} className="border-b border-line">
                  <td className="py-2 pr-3 text-ink">{row.item}</td>
                  <td
                    className={`py-2 pr-3 font-medium whitespace-nowrap ${
                      STATUS_STYLE[row.status] || "text-ink"
                    }`}
                  >
                    {row.status}
                  </td>
                  <td className="py-2 text-ink/50">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {report.summary && (
          <section className="mb-8">
            <h2 className="font-display text-lg text-ink mb-2">整體建議</h2>
            <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
              {report.summary}
            </p>
          </section>
        )}

        <footer className="border-t border-line pt-4 mt-10 text-xs text-ink/40 flex justify-between">
          <span>本報告由 168 汽車維修中心 提供</span>
          <span className="font-mono-data">報告編號 #{report.id}</span>
        </footer>
      </div>
    </main>
  );
}
