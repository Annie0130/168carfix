"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="border border-ink/20 text-ink px-4 py-2 rounded-sm hover:bg-ink hover:text-paper transition-colors font-mono-data text-sm"
    >
      列印 / 下載 PDF
    </button>
  );
}
