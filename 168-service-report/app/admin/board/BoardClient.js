"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { STATUS_FLOW, STATUS_COLUMN_STYLE, TECHNICIANS, formatDuration } from "@/lib/board";

const REFRESH_MS = 45000;

export default function BoardClient() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0); // 用來每分鐘重新計算停留時間
  const [search, setSearch] = useState("");
  const [techFilter, setTechFilter] = useState("");
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [waitingOnly, setWaitingOnly] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/vehicles/board");
    if (res.ok) {
      const data = await res.json();
      setVehicles(data.vehicles);
      setLastUpdated(new Date());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const dataInterval = setInterval(load, REFRESH_MS);
    const tickInterval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(tickInterval);
    };
  }, [load]);

  async function updateStatus(id, status) {
    setVehicles((list) => list.map((v) => (v.id === id ? { ...v, status, status_changed_at: new Date().toISOString() } : v)));
    await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function clearStatus(id) {
    setVehicles((list) => list.filter((v) => v.id !== id));
    await fetch(`/api/vehicles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clear_status: true }),
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (techFilter && v.assigned_technician !== techFilter) return false;
      if (sameDayOnly && !v.same_day_pickup) return false;
      if (waitingOnly && !v.customer_waiting) return false;
      if (!q) return true;
      const plate = (v.plate || "").toLowerCase();
      const phone = (v.phone || "").toLowerCase();
      const name = (v.owner_name || "").toLowerCase();
      return (
        plate.includes(q) ||
        plate.slice(-4).includes(q) ||
        phone.includes(q) ||
        phone.slice(-4).includes(q) ||
        name.includes(q)
      );
    });
  }, [vehicles, search, techFilter, sameDayOnly, waitingOnly]);

  return (
    <main className="min-h-screen bg-[#1B1F24] text-white">
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
        <div>
          <Link href="/admin/dashboard" className="text-xs text-white/40 hover:text-white/70">
            ← 回車輛總覽
          </Link>
          <h1 className="font-display text-2xl font-semibold mt-1">廠內即時看板</h1>
        </div>
        <p className="text-xs text-white/30 font-mono-data">
          {lastUpdated ? `更新於 ${lastUpdated.toLocaleTimeString("zh-TW")}` : "載入中..."} · 每 45 秒自動整頁更新
        </p>
      </div>

      <div className="px-6 py-4 flex flex-wrap gap-3 items-center border-b border-white/10">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋車牌末4碼 / 電話 / 車主姓名"
          className="bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 text-sm w-64 outline-none focus:border-orange-400 placeholder:text-white/30"
        />
        <select
          value={techFilter}
          onChange={(e) => setTechFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-sm px-3 py-1.5 text-sm outline-none focus:border-orange-400"
        >
          <option value="">全部技師</option>
          {TECHNICIANS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <button
          onClick={() => setSameDayOnly((v) => !v)}
          className={`px-3 py-1.5 rounded-sm text-sm border transition-colors ${
            sameDayOnly ? "bg-orange-500 border-orange-500 text-white" : "border-white/10 text-white/60"
          }`}
        >
          當日交車
        </button>
        <button
          onClick={() => setWaitingOnly((v) => !v)}
          className={`px-3 py-1.5 rounded-sm text-sm border transition-colors ${
            waitingOnly ? "bg-blue-500 border-blue-500 text-white" : "border-white/10 text-white/60"
          }`}
        >
          留車中
        </button>
      </div>

      {loading ? (
        <p className="p-6 text-white/40 text-sm">載入中...</p>
      ) : (
        <div className="p-6 flex gap-4 overflow-x-auto">
          {STATUS_FLOW.map((status) => {
            const cards = filtered.filter((v) => v.status === status);
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId) updateStatus(dragId, status);
                  setDragId(null);
                }}
                className={`flex-shrink-0 w-64 bg-white/5 rounded-sm border-t-4 ${STATUS_COLUMN_STYLE[status]}`}
              >
                <div className="px-3 py-2.5 flex items-center justify-between border-b border-white/10">
                  <span className="text-sm font-medium">{status}</span>
                  <span className="text-xs text-white/40 font-mono-data">{cards.length}</span>
                </div>
                <div className="p-2 space-y-2 min-h-[120px]">
                  {cards.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      onDragStart={() => setDragId(v.id)}
                      onQuickMove={(next) => updateStatus(v.id, next)}
                      onClearStatus={() => clearStatus(v.id)}
                      isLastColumn={status === STATUS_FLOW[STATUS_FLOW.length - 1]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function VehicleCard({ vehicle, onDragStart, onQuickMove, onClearStatus, isLastColumn }) {
  const currentIndex = STATUS_FLOW.indexOf(vehicle.status);
  const nextStatus = STATUS_FLOW[currentIndex + 1];
  const prevStatus = STATUS_FLOW[currentIndex - 1];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-[#252A31] border border-white/10 rounded-sm p-3 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-1.5">
        <Link
          href={`/admin/vehicles/${vehicle.id}`}
          className="font-mono-data font-semibold text-lg hover:text-orange-400"
        >
          {vehicle.plate}
        </Link>
        {vehicle.same_day_pickup && (
          <span className="text-[10px] bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded-sm">當日交車</span>
        )}
      </div>
      <p className="text-xs text-white/50 mb-0.5">{vehicle.car_model || "未填車型"}</p>
      <p className="text-xs text-white/50 mb-2 font-mono-data">{vehicle.phone}</p>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
          {vehicle.assigned_technician || "未指派"}
        </span>
        {vehicle.customer_waiting && (
          <span className="text-[10px] text-blue-300">留車中</span>
        )}
      </div>

      <p className="text-xs text-white/40 font-mono-data mb-2">
        停留 {formatDuration(vehicle.status_changed_at)}
      </p>

      <div className="flex gap-1.5">
        {prevStatus && (
          <button
            onClick={() => onQuickMove(prevStatus)}
            className="flex-1 text-xs border border-white/10 rounded-sm py-1 text-white/50 hover:border-white/30"
          >
            ← 上一步
          </button>
        )}
        {nextStatus && (
          <button
            onClick={() => onQuickMove(nextStatus)}
            className="flex-1 text-xs bg-orange-500/80 hover:bg-orange-500 rounded-sm py-1 text-white"
          >
            下一步 →
          </button>
        )}
        {isLastColumn && (
          <button
            onClick={onClearStatus}
            className="flex-1 text-xs bg-emerald-600/80 hover:bg-emerald-600 rounded-sm py-1 text-white"
          >
            交車完成
          </button>
        )}
      </div>
    </div>
  );
}
