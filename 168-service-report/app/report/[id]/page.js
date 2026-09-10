import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { requireAdmin, vehicleCookieName, isValidVehicleSession } from "@/lib/auth";
import { STATUS_STYLE, QUANTIFIED_ITEMS } from "@/lib/checklist";
import StatusBadge from "@/components/StatusBadge";
import ProgressBar from "@/components/ProgressBar";
import HelpTooltip from "@/components/HelpTooltip";
import { GLOSSARY } from "@/lib/glossary";
import { computeHealthScore } from "@/lib/healthScore";
import HealthGauge from "@/components/HealthGauge";
import VehicleDiagramSection from "@/components/VehicleDiagramSection";
import TrendChart from "@/components/TrendChart";
import ReviewGenerator from "@/components/ReviewGenerator";
import PrintButton from "./PrintButton";
import ApproveButton from "./ApproveButton";
import LineShareButton from "./LineShareButton";
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
  const quantified = report.quantified || {};
  const parts = report.parts || [];
  const advisoryItems = report.advisory_items || [];
  const partsTotal = parts.reduce(
    (sum, p) => sum + (Number(p.qty) || 0) * (Number(p.unit_price) || 0),
    0
  );

  // 健康度總分:彙整檢測項目 + 數值化項目的狀態
  const quantifiedStatuses = {};
  for (const q of QUANTIFIED_ITEMS) {
    const values = quantified[q.key];
    if (!values) continue;
    for (const f of q.fields) {
      const v = values[f.key];
      if (v === "" || v === undefined || v === null) continue;
      quantifiedStatuses[`${q.key}_${f.key}`] = q.computeStatus(v);
    }
  }
  const healthScore = computeHealthScore(checklist, quantifiedStatuses);

  // 里程/花費趨勢:抓這台車全部報告
  const historyRes = await sql`
    SELECT report_date, mileage, parts FROM reports
    WHERE vehicle_id = ${vehicle.id}
    ORDER BY report_date ASC, created_at ASC
  `;
  const trendData = historyRes.rows.map((r) => ({
    label: String(r.report_date).slice(5, 10),
    mileage: r.mileage || 0,
    spend: (r.parts || []).reduce((s, p) => s + (Number(p.qty) || 0) * (Number(p.unit_price) || 0), 0),
  }));
  const mileageTrend = trendData.filter((d) => d.mileage > 0).map((d) => ({ label: d.label, value: d.mileage }));
  const spendTrend = trendData.map((d) => ({ label: d.label, value: d.spend }));

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || `https://${headers().get("host")}`;
  const reportUrl = `${baseUrl}/report/${report.id}`;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="max-w-2xl mx-auto flex justify-end gap-2 mb-4 no-print">
        <LineShareButton
          url={reportUrl}
          text={`${vehicle.plate} 車輛檢測報告 - 168汽車維修中心`}
        />
        <PrintButton />
      </div>

      <div className="print-sheet max-w-2xl mx-auto bg-white border border-line rounded-sm p-8 md:p-10 space-y-8">
        <header className="flex items-start justify-between border-b border-line pb-6">
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

        <section className="grid grid-cols-2 gap-4 text-sm">
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

        {healthScore && (
          <section className="flex justify-center border-y border-line py-6">
            <HealthGauge score={healthScore.score} label={healthScore.label} color={healthScore.color} />
          </section>
        )}

        <section>
          <VehicleDiagramSection checklist={checklist} />
        </section>

        {Object.keys(quantified).some((k) => quantified[k] && Object.values(quantified[k]).some((v) => v !== "" && v !== null && v !== undefined)) && (
          <section>
            <h2 className="font-display text-lg text-ink mb-3">關鍵零件狀態</h2>
            <div className="space-y-4">
              {QUANTIFIED_ITEMS.map((q) => {
                const values = quantified[q.key];
                if (!values) return null;
                const hasAny = q.fields.some((f) => values[f.key] !== "" && values[f.key] !== undefined && values[f.key] !== null);
                if (!hasAny) return null;
                return (
                  <div key={q.key}>
                    <p className="text-sm font-medium text-ink mb-2">
                      {q.label}
                      <HelpTooltip text={GLOSSARY[q.label]} />
                    </p>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      {q.fields.map((f) => {
                        const v = values[f.key];
                        if (v === "" || v === undefined || v === null) return null;
                        const status = q.computeStatus(v);
                        const pct = q.computePercent(v);
                        return (
                          <ProgressBar
                            key={f.key}
                            label={f.label}
                            value={pct}
                            rawValue={v}
                            unit={q.unit}
                            status={status}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {parts.length > 0 && (
          <section>
            <h2 className="font-display text-lg text-ink mb-3">本次維修 / 更換零件</h2>
            <table className="w-full text-sm border-t border-line">
              <thead>
                <tr className="text-ink/40 text-xs">
                  <th className="text-left py-1.5 font-normal">項目</th>
                  <th className="text-right py-1.5 font-normal">數量</th>
                  <th className="text-right py-1.5 font-normal">單價</th>
                  <th className="text-right py-1.5 font-normal">小計</th>
                  <th className="text-left py-1.5 font-normal pl-4">保固</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="py-2 text-ink">{p.name}</td>
                    <td className="py-2 text-right font-mono-data">{p.qty}</td>
                    <td className="py-2 text-right font-mono-data">{p.unit_price}</td>
                    <td className="py-2 text-right font-mono-data">
                      {(Number(p.qty) || 0) * (Number(p.unit_price) || 0)}
                    </td>
                    <td className="py-2 text-ink/50 pl-4">{p.warranty || "—"}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line">
                  <td colSpan={3} className="py-2 text-right text-ink/60">總計</td>
                  <td className="py-2 text-right font-mono-data font-medium">{partsTotal}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </section>
        )}

        {(report.next_service_mileage || report.next_service_date) && (
          <section>
            <h2 className="font-display text-lg text-ink mb-3">下次保養建議</h2>
            <div className="flex gap-6 text-sm">
              {report.next_service_mileage && (
                <div>
                  <p className="text-ink/40 mb-0.5">建議里程</p>
                  <p className="font-mono-data text-ink">{report.next_service_mileage.toLocaleString()} km</p>
                </div>
              )}
              {report.next_service_date && (
                <div>
                  <p className="text-ink/40 mb-0.5">建議日期</p>
                  <p className="font-mono-data text-ink">{String(report.next_service_date).slice(0, 10)}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {advisoryItems.length > 0 && (
          <section>
            <h2 className="font-display text-lg text-ink mb-3">待修 / 建議後續更換項目</h2>
            <div className="flex flex-wrap gap-2">
              {advisoryItems.map((a, i) => (
                <span key={i} className="bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-3 py-1 text-sm">
                  {a}
                </span>
              ))}
            </div>
          </section>
        )}

        {report.summary && (
          <section>
            <h2 className="font-display text-lg text-ink mb-2">整體建議</h2>
            <p className="text-sm text-ink/80 whitespace-pre-wrap leading-relaxed">
              {report.summary}
            </p>
          </section>
        )}

        {mileageTrend.length > 1 && (
          <section>
            <h2 className="font-display text-lg text-ink mb-3">里程 / 保養花費趨勢</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-ink/40 mb-1">里程數(km)</p>
                <TrendChart data={mileageTrend} type="line" color="#3B5A73" />
              </div>
              <div>
                <p className="text-xs text-ink/40 mb-1">單次花費($)</p>
                <TrendChart data={spendTrend} type="bar" color="#E8A33D" />
              </div>
            </div>
          </section>
        )}

        {isVehicleOwner && (
          <section className="no-print">
            <ApproveButton
              reportId={report.id}
              approved={report.customer_approved}
              approvedAt={report.customer_approved_at}
            />
          </section>
        )}

        {isVehicleOwner && (
          <section className="no-print">
            <ReviewGenerator />
          </section>
        )}

        <footer className="border-t border-line pt-4 text-xs text-ink/40 flex justify-between">
          <span>本報告由 168 汽車維修中心 提供</span>
          <span className="font-mono-data">報告編號 #{report.id}</span>
        </footer>
      </div>
    </main>
  );
}
