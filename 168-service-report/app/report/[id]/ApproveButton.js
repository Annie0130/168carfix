"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveButton({ reportId, approved, approvedAt }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (approved) {
    return (
      <div className="border border-green-300 bg-green-50 text-green-700 rounded-sm px-4 py-3 text-sm">
        ✓ 已於 {new Date(approvedAt).toLocaleString("zh-TW")} 確認同意施作
      </div>
    );
  }

  async function handleApprove() {
    setLoading(true);
    const res = await fetch(`/api/reports/${reportId}/approve`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="w-full bg-steel text-white py-3 rounded-sm hover:bg-ink transition-colors font-medium disabled:opacity-50 no-print"
    >
      {loading ? "處理中..." : "我同意此報價,同意施作"}
    </button>
  );
}
