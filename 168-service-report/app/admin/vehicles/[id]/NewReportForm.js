"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STANDARD_CHECKLIST, STATUS_OPTIONS } from "@/lib/checklist";

function initialChecklist() {
  return STANDARD_CHECKLIST.map((item) => ({ item, status: "正常", note: "" }));
}

export default function NewReportForm({ vehicleId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [checklist, setChecklist] = useState(initialChecklist);
  const [mileage, setMileage] = useState("");
  const [technician, setTechnician] = useState("");
  const [summary, setSummary] = useState("");
  const [reportDate, setReportDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateItem(index, field, value) {
    setChecklist((list) =>
      list.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
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
        summary,
        technician,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setOpen(false);
      setChecklist(initialChecklist());
      setSummary("");
      setMileage("");
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
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-white rounded-sm p-5 space-y-5"
    >
      <h3 className="font-display text-lg text-ink">建立新檢測報告</h3>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-ink/70 mb-1">日期</label>
          <input
            type="date"
            className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
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

      <div>
        <p className="text-sm text-ink/70 mb-2">檢測項目</p>
        <div className="border border-line rounded-sm divide-y divide-line">
          {checklist.map((row, i) => (
            <div key={row.item} className="grid grid-cols-12 gap-2 items-center px-3 py-2">
              <span className="col-span-4 text-sm text-ink">{row.item}</span>
              <select
                className="col-span-3 border border-line rounded-sm px-2 py-1 text-sm outline-none focus:border-steel"
                value={row.status}
                onChange={(e) => updateItem(i, "status", e.target.value)}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                className="col-span-5 border border-line rounded-sm px-2 py-1 text-sm outline-none focus:border-steel"
                placeholder="備註(選填)"
                value={row.note}
                onChange={(e) => updateItem(i, "note", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1">整體建議</label>
        <textarea
          className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="給車主的建議,例如下次保養時間、需留意項目..."
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
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm text-ink/60 hover:text-ink"
        >
          取消
        </button>
      </div>
    </form>
  );
}
