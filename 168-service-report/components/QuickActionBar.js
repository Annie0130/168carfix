"use client";

export default function QuickActionBar({ shopPhone, shopAddress }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopAddress)}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-line flex no-print">
      <a
        href={`tel:${shopPhone}`}
        className="flex-1 flex flex-col items-center justify-center py-3 text-ink hover:bg-paper transition-colors"
      >
        <span className="text-lg">📞</span>
        <span className="text-xs mt-0.5">致電車廠</span>
      </a>
      <div className="w-px bg-line" />
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-3 text-ink hover:bg-paper transition-colors"
      >
        <span className="text-lg">📍</span>
        <span className="text-xs mt-0.5">導航取車</span>
      </a>
    </div>
  );
}
