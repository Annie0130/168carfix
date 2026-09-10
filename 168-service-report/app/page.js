import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="font-mono-data text-xs tracking-wide text-steel mb-3">
        168 汽車維修中心
      </p>
      <h1 className="font-display text-4xl font-semibold text-ink mb-4">
        車輛電子檢測報告系統
      </h1>
      <p className="text-ink/70 max-w-sm mb-8 leading-relaxed">
        客人請掃描車上的 QR Code 查看您的車輛維修紀錄。
        <br />
        店內人員請由下方進入後台。
      </p>
      <Link
        href="/admin/login"
        className="border border-ink/20 text-ink px-6 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors font-mono-data text-sm"
      >
        店內後台登入
      </Link>
    </main>
  );
}
