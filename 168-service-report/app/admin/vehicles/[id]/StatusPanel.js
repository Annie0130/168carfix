"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { STATUS_FLOW, TECHNICIANS } from "@/lib/board";

function toLocalInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function StatusPanel({ vehicle }) {
  const router = useRouter();
  const [status, setStatus] = useState(vehicle.status || "");
  const [technician, setTechnician] = useState(vehicle.assigned_technician || "");
  const [estCompletion, setEstCompletion] = useState(toLocalInputValue(vehicle.estimated_completion));
  const [sameDayPickup, setSameDayPickup] = useState(vehicle.same_day_pickup);
  const [customerWaiting, setCustomerWaiting] = useState(vehicle.customer_waiting);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status || null,
        assigned_technician: technician || null,
        estimated_completion: estCompletion || null,
        same_day_pickup: sameDayPickup,
        customer_waiting: customerWaiting,
      }),
    });
    setSaving(false);
    router.refresh();
  }

  async function startNewJob() {
    setStatus("待檢測");
    setSaving(true);
    await fetch(`/api/vehicles/${vehicle.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "待檢測" }),
    });
    setSaving(false);
    router.refresh();
  }

  if (!vehicle.status) {
    return (
      <div className="border border-line bg-white rounded-sm p-4 flex items-center justify-between">
        <p className="text-sm text-ink/60">目前沒有進行中的維修案件</p>
        <button
          onClick={startNewJob}
          disabled={saving}
          className="bg-ink text-paper px-3 py-1.5 rounded-sm text-sm hover:bg-steel disabled:opacity-50"
        >
          開始新的維修流程
        </button>
      </div>
    );
  }

  return (
    <div className="border border-line bg-white rounded-sm p-4 space-y-3">
      <p className="text-sm font-medium text-ink">目前維修進度(看板同步)</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-ink/50 mb-1">狀態</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-line rounded-sm px-2 py-1.5 text-sm outline-none focus:border-steel"
          >
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-ink/50 mb-1">負責技師</label>
          <select
            value={technician}
            onChange={(e) => setTechnician(e.target.value)}
            className="w-full border border-line rounded-sm px-2 py-1.5 text-sm outline-none focus:border-steel"
          >
            <option value="">未指派</option>
            {TECHNICIANS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-ink/50 mb-1">預估完工 / 取車時間</label>
          <input
            type="datetime-local"
            value={estCompletion}
            onChange={(e) => setEstCompletion(e.target.value)}
            className="w-full border border-line rounded-sm px-2 py-1.5 text-sm outline-none focus:border-steel"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-sm text-ink/70">
          <input type="checkbox" checked={sameDayPickup} onChange={(e) => setSameDayPickup(e.target.checked)} />
          當日交車
        </label>
        <label className="flex items-center gap-1.5 text-sm text-ink/70">
          <input type="checkbox" checked={customerWaiting} onChange={(e) => setCustomerWaiting(e.target.checked)} />
          留車中
        </label>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="bg-ink text-paper px-4 py-1.5 rounded-sm text-sm hover:bg-steel disabled:opacity-50"
      >
        {saving ? "儲存中..." : "儲存"}
      </button>
    </div>
  );
}
