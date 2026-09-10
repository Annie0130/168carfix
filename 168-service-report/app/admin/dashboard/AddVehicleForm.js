"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddVehicleForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plate: "",
    phone: "",
    owner_name: "",
    car_model: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setForm({ plate: "", phone: "", owner_name: "", car_model: "" });
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "新增失敗");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border border-ink/20 text-ink px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors font-mono-data text-sm"
      >
        + 新增車輛
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-line bg-white rounded-sm p-5 space-y-3"
    >
      <h3 className="font-display text-lg text-ink mb-1">新增車輛</h3>

      <div>
        <label className="block text-sm text-ink/70 mb-1">車牌號碼 *</label>
        <input
          required
          className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel font-mono-data"
          value={form.plate}
          onChange={(e) => update("plate", e.target.value)}
          placeholder="ABC-1234"
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1">車主手機 *</label>
        <input
          required
          className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="0912345678"
        />
        <p className="text-xs text-ink/40 mt-1">客人會用手機「末四碼」登入查看報告</p>
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1">車主姓名</label>
        <input
          className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
          value={form.owner_name}
          onChange={(e) => update("owner_name", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm text-ink/70 mb-1">車型</label>
        <input
          className="w-full border border-line rounded-sm px-3 py-2 outline-none focus:border-steel"
          value={form.car_model}
          onChange={(e) => update("car_model", e.target.value)}
          placeholder="BMW 320i"
        />
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-paper px-4 py-2 rounded-sm hover:bg-steel transition-colors text-sm disabled:opacity-50"
        >
          {loading ? "新增中..." : "建立車輛"}
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
