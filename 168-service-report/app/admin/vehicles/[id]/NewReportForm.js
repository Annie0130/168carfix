"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  STANDARD_CHECKLIST,
  STATUS_OPTIONS,
  QUANTIFIED_ITEMS,
} from "@/lib/checklist";
import StatusBadge from "@/components/StatusBadge";
import VoiceInputButton from "@/components/VoiceInputButton";

function initialChecklist() {
  return STANDARD_CHECKLIST.map((item) => ({ item, status: "正常", note: "" }));
}

function initialQuantified() {
  const obj = {};
  for (const q of QUANTIFIED_ITEMS) {
    obj[q.key] = {};
    for (const f of q.fields) obj[q.key][f.key] = "";
  }
  return obj;
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export default function NewReportForm({ vehicleId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [checklist, setChecklist] = useState(initialChecklist);
  const [quantified, setQuantified] = useState(initialQuantified);
  const [mileage, setMileage] = useState("");
  const [technician, setTechnician] = useState("");
  const [summary, setSummary] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [parts, setParts] = useState([]);
  const [partDraft, setPartDraft] = useState({ name: "", qty: 1, unit_price: "", warranty: "" });

  const [nextMileageChoice, setNextMileageChoice] = useState("5000");
  const [customNextMileage, setCustomNextMileage] = useState("");
  const [nextServiceDate, setNextServiceDate] = useState(addMonths(reportDate, 6));

  const [advisoryItems, setAdvisoryItems] = useState([]);
  const [advisoryDraft, setAdvisoryDraft] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateChecklistItem(index, field, value) {
    setChecklist((list) =>
      list.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function updateQuantified(key, field, value) {
    setQuantified((q) => ({ ...q, [key]: { ...q[key], [field]: value } }));
  }

  const partsTotal = useMemo(
    () => parts.reduce((sum, p) => sum + (Number(p.qty) || 0) * (Number(p.unit_price) || 0), 0),
    [parts]
  );

  function addPart() {
    if (!partDraft.name.trim()) return;
    setParts((list) => [...list, partDraft]);
    setPartDraft({ name: "", qty: 1, unit_price: "", warranty: "" });
  }

  function removePart(i) {
    setParts((list) => list.filter((_, idx) => idx !== i));
  }

  function addAdvisory() {
    if (!advisoryDraft.trim()) return;
    setAdvisoryItems((list) => [...list, advisoryDraft.trim()]);
    setAdvisoryDraft("");
  }

  function removeAdvisory(i) {
    setAdvisoryItems((list) => list.filter((_, idx) => idx !== i));
  }

  function computedNextMileage() {
    if (nextMileageChoice === "custom") return customNextMileage ? Number(customNextMileage) : null;
    if (!mileage) return null;
    return Number(mileage) + Number(nextMileageChoice);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicle_id: vehicleId,
        report_date: reportDate,
        mileage: mileage ? Number(mileage) : null,
        checklist,
        quantified,
        summary,
        technician,
        parts,
        advisory_items: advisoryItems,
        next_service_mileage: computedNextMileage(),
        next_service_date: nextServiceDate || null,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "建立失敗");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-ink text-paper px-4 py-2 rounded-sm hover:bg-steel transition-colors text-sm"
      >
        + 建立新檢測報告
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white rounded-sm p-5 space-y-6">
      <h3 className="font-display text-lg text-ink">建立新檢測報告</h3>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-ink/70 mb-1">日期</label>
          <input
            type="date"
            className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
            value={reportDate}
            onChange={(e) => {
              setReportDate(e.target.value);
              setNextServiceDate(addMonths(e.target.value, 6));
            }}
          />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1">里程數(km)</label>
          <input
            type="number"
            className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1">技師 / 店員</label>
          <input
            className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
          />
        </div>
      </div>

      {/* 數值化關鍵項目 */}
      <div>
        <p className="text-sm text-ink/70 mb-2">關鍵項目數值</p>
        <div className="border border-line rounded-sm divide-y divide-line">
          {QUANTIFIED_ITEMS.map((q) => (
            <div key={q.key} className="px-3 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-ink">{q.label}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {q.fields.map((f) => {
                  const val = quantified[q.key]?.[f.key] ?? "";
                  const status = q.computeStatus(val);
                  return (
                    <div key={f.key}>
                      <label className="block text-xs text-ink/50 mb-1">{f.label}</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border border-line rounded-sm px-2 py-1.5 text-sm outline-none focus:border-steel"
                          value={val}
                          onChange={(e) => updateQuantified(q.key, f.key, e.target.value)}
                          placeholder={q.unit}
                        />
                      </div>
                      {status && <div className="mt-1"><StatusBadge status={status} /></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 一般檢測項目 */}
      <div>
        <p className="text-sm text-ink/70 mb-2">檢測項目</p>
        <div className="border border-line rounded-sm divide-y divide-line">
          {checklist.map((row, i) => (
            <div key={row.item} className="px-3 py-2.5">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-sm text-ink">{row.item}</span>
                <div className="flex gap-1.5">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateChecklistItem(i, "status", s)}
                      className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                        row.status === s
                          ? s === "正常"
                            ? "bg-green-600 text-white border-green-600"
                            : s === "建議留意"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-red-600 text-white border-red-600"
                          : "border-line text-ink/50 hover:border-ink/30"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <input
                className="w-full border border-line rounded-sm px-2 py-1 text-sm outline-none focus:border-steel"
                placeholder="備註(選填)"
                value={row.note}
                onChange={(e) => updateChecklistItem(i, "note", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 本次維修/耗材明細 */}
      <div>
        <p className="text-sm text-ink/70 mb-2">本次維修 / 耗材明細</p>
        <div className="border border-line rounded-sm overflow-hidden">
          {parts.length > 0 && (
            <table className="w-full text-sm">
              <thead className="bg-paper text-ink/50 text-xs">
                <tr>
                  <th className="text-left px-3 py-1.5">項目</th>
                  <th className="text-right px-3 py-1.5">數量</th>
                  <th className="text-right px-3 py-1.5">單價</th>
                  <th className="text-right px-3 py-1.5">小計</th>
                  <th className="text-left px-3 py-1.5">保固</th>
                  <th className="px-2"></th>
                </tr>
              </thead>
              <tbody>
                {parts.map((p, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-3 py-1.5 text-ink">{p.name}</td>
                    <td className="px-3 py-1.5 text-right font-mono-data">{p.qty}</td>
                    <td className="px-3 py-1.5 text-right font-mono-data">{p.unit_price}</td>
                    <td className="px-3 py-1.5 text-right font-mono-data">
                      {(Number(p.qty) || 0) * (Number(p.unit_price) || 0)}
                    </td>
                    <td className="px-3 py-1.5 text-ink/60">{p.warranty || "—"}</td>
                    <td className="px-2 text-center">
                      <button type="button" onClick={() => removePart(i)} className="text-ink/30 hover:text-red-600">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line bg-paper">
                  <td colSpan={3} className="px-3 py-1.5 text-right text-ink/60">總計</td>
                  <td className="px-3 py-1.5 text-right font-mono-data font-medium">{partsTotal}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          )}

          <div className="grid grid-cols-12 gap-2 p-3 bg-paper/50">
            <input
              className="col-span-4 border border-line rounded-sm px-2 py-1.5 text-sm"
              placeholder="項目名稱"
              value={partDraft.name}
              onChange={(e) => setPartDraft((d) => ({ ...d, name: e.target.value }))}
            />
            <input
              type="number"
              className="col-span-1 border border-line rounded-sm px-2 py-1.5 text-sm"
              placeholder="數量"
              value={partDraft.qty}
              onChange={(e) => setPartDraft((d) => ({ ...d, qty: e.target.value }))}
            />
            <input
              type="number"
              className="col-span-2 border border-line rounded-sm px-2 py-1.5 text-sm"
              placeholder="單價"
              value={partDraft.unit_price}
              onChange={(e) => setPartDraft((d) => ({ ...d, unit_price: e.target.value }))}
            />
            <input
              className="col-span-3 border border-line rounded-sm px-2 py-1.5 text-sm"
              placeholder="保固(例如: 1年/2萬公里)"
              value={partDraft.warranty}
              onChange={(e) => setPartDraft((d) => ({ ...d, warranty: e.target.value }))}
            />
            <button
              type="button"
              onClick={addPart}
              className="col-span-2 bg-ink text-paper rounded-sm text-sm hover:bg-steel"
            >
              + 新增
            </button>
          </div>
        </div>
      </div>

      {/* 下次保養建議 */}
      <div>
        <p className="text-sm text-ink/70 mb-2">下次保養建議</p>
        <div className="border border-line rounded-sm p-3 space-y-3">
          <div>
            <label className="block text-xs text-ink/50 mb-1">建議里程</label>
            <div className="flex gap-2 flex-wrap">
              {["5000", "10000", "custom"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setNextMileageChoice(v)}
                  className={`px-3 py-1.5 rounded-sm text-sm border ${
                    nextMileageChoice === v
                      ? "bg-ink text-paper border-ink"
                      : "border-line text-ink/60"
                  }`}
                >
                  {v === "custom" ? "自訂" : `+ ${v} km`}
                </button>
              ))}
              {nextMileageChoice === "custom" && (
                <input
                  type="number"
                  className="border border-line rounded-sm px-2 py-1.5 text-sm w-32"
                  placeholder="里程數"
                  value={customNextMileage}
                  onChange={(e) => setCustomNextMileage(e.target.value)}
                />
              )}
            </div>
            {mileage && (
              <p className="text-xs text-ink/40 mt-1">
                預估下次里程約 {computedNextMileage() || "—"} km
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-ink/50 mb-1">建議日期</label>
            <input
              type="date"
              className="border border-line rounded-sm px-3 py-2 text-sm outline-none focus:border-steel"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 待修/建議後續更換項目 */}
      <div>
        <p className="text-sm text-ink/70 mb-2">待修 / 建議後續更換項目</p>
        <div className="border border-line rounded-sm p-3">
          <div className="flex flex-wrap gap-2 mb-2">
            {advisoryItems.map((a, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-paper border border-line rounded-full px-3 py-1 text-sm text-ink">
                {a}
                <button type="button" onClick={() => removeAdvisory(i)} className="text-ink/30 hover:text-red-600">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-line rounded-sm px-2 py-1.5 text-sm"
              placeholder="例如:前煞車來令片,下次進廠建議更換"
              value={advisoryDraft}
              onChange={(e) => setAdvisoryDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAdvisory();
                }
              }}
            />
            <button type="button" onClick={addAdvisory} className="bg-ink text-paper px-3 rounded-sm text-sm hover:bg-steel">
              加入
            </button>
          </div>
        </div>
      </div>

      {/* 整體建議 */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <label className="text-sm text-ink/70">整體建議</label>
          <VoiceInputButton onResult={(text) => setSummary((s) => (s ? s + " " + text : text))} />
        </div>
        <textarea
          className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="給車主的建議,可以點麥克風用說的"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-paper px-4 py-2 rounded-sm hover:bg-steel transition-colors text-sm disabled:opacity-50"
        >
          {loading ? "建立中..." : "建立報告"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-ink/60 hover:text-ink">
          取消
        </button>
      </div>
    </form>
  );
}
