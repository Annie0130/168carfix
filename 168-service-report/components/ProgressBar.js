import { STATUS_BAR_COLOR } from "@/lib/checklist";

// value: 0-100 百分比, status: 用來決定顏色
export default function ProgressBar({ label, value, unit, rawValue, status }) {
  const barColor = STATUS_BAR_COLOR[status] || "bg-gray-300";
  const pct = Math.round(value);

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-sm text-ink/70">{label}</span>
        <span className="font-mono-data text-sm text-ink">
          {rawValue}
          {unit}
        </span>
      </div>
      <div className="h-2 bg-line rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
