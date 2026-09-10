import { STATUS_STYLE } from "@/lib/checklist";

export default function StatusBadge({ status }) {
  if (!status) return <span className="text-ink/30 text-sm">—</span>;
  const style = STATUS_STYLE[status] || "bg-gray-100 text-gray-600 border-gray-300";
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {status}
    </span>
  );
}
