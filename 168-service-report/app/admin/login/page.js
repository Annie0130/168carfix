"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "登入失敗");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-white p-8 rounded-sm"
      >
        <p className="font-mono-data text-xs tracking-wide text-steel mb-2">
          168 汽車維修中心
        </p>
        <h1 className="font-display text-2xl font-semibold text-ink mb-6">
          店內後台登入
        </h1>

        <label className="block text-sm text-ink/70 mb-1">帳號</label>
        <input
          className="w-full border border-line rounded-sm px-3 py-2 mb-4 outline-none focus:border-steel"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />

        <label className="block text-sm text-ink/70 mb-1">密碼</label>
        <input
          type="password"
          className="w-full border border-line rounded-sm px-3 py-2 mb-4 outline-none focus:border-steel"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper py-2 rounded-sm hover:bg-steel transition-colors disabled:opacity-50"
        >
          {loading ? "登入中..." : "登入"}
        </button>
      </form>
    </main>
  );
}
