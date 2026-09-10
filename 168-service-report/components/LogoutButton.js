"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-ink/50 hover:text-ink font-mono-data"
    >
      登出
    </button>
  );
}
