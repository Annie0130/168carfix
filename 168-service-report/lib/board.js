// 廠內看板流程欄位(依序)
export const STATUS_FLOW = [
  "待檢測",
  "檢查中",
  "待客戶確認",
  "待料中",
  "施工中",
  "完工待交車",
];

// 看板欄位配色(深灰底 + 亮橘/科技藍主題)
export const STATUS_COLUMN_STYLE = {
  待檢測: "border-t-slate-400",
  檢查中: "border-t-blue-400",
  待客戶確認: "border-t-amber-400",
  待料中: "border-t-purple-400",
  施工中: "border-t-orange-500",
  完工待交車: "border-t-emerald-400",
};

// 固定技師名單(之後可以再加人)
export const TECHNICIANS = ["阿榮"];

// 客人端進度條的簡化步驟,並提供狀態 -> 步驟索引的對照
export const CUSTOMER_STEPS = ["入廠", "健檢", "報價", "施工", "完工"];

export function statusToStepIndex(status) {
  const map = {
    待檢測: 0,
    檢查中: 1,
    待客戶確認: 2,
    待料中: 3,
    施工中: 3,
    完工待交車: 4,
  };
  return map[status] ?? 0;
}

// 停留時間格式化,例如「2 小時 15 分」
export function formatDuration(fromDate) {
  const ms = Date.now() - new Date(fromDate).getTime();
  const totalMin = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} 分`;
  return `${h} 小時 ${m} 分`;
}
