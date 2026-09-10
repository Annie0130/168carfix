"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyForm({ plate }) {
  const router = useRouter();
  const [phoneLast4, setPhoneLast4] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/vehicles/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plate, phoneLast4 }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "驗證失敗");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-white p-8 rounded-sm text-center"
      >
        <p className="font-mono-data text-xs tracking-wide text-steel mb-2">
          168 汽車維修中心
        </p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">
          查看車輛檢測報告
        </h1>
        <p className="font-mono-data text-ink/60 mb-6">{plate}</p>

        <label className="block text-sm text-ink/70 mb-1 text-left">
          請輸入車主手機末四碼
        </label>
        <input
          inputMode="numeric"
          maxLength={4}
          className="w-full border border-line rounded-sm px-3 py-2 mb-4 outline-none focus:border-steel text-center tracking-widest text-lg font-mono-data"
          value={phoneLast4}
          onChange={(e) => setPhoneLast4(e.target.value.replace(/\D/g, ""))}
          autoFocus
          placeholder="0000"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading || phoneLast4.length !== 4}
          className="w-full bg-ink text-paper py-2 rounded-sm hover:bg-steel transition-colors disabled:opacity-50"
        >
          {loading ? "查詢中..." : "查看報告"}
        </button>
      </form>
    </main>
  );
}
