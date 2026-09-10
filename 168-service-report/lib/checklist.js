// 業界標準檢測項目(非數值化,技師用三色標籤評估)
export const STANDARD_CHECKLIST = [
  "煞車油",
  "冷卻液",
  "輪胎胎壓",
  "雨刷",
  "空調濾網",
  "引擎皮帶",
  "前後燈光",
  "底盤 / 懸吊",
  "變速箱油",
  "喇叭 / 警示系統",
];

// 三色狀態標籤
export const STATUS_OPTIONS = ["正常", "建議留意", "需立即更換"];

export const STATUS_STYLE = {
  正常: "bg-green-100 text-green-700 border-green-300",
  建議留意: "bg-amber-100 text-amber-700 border-amber-300",
  需立即更換: "bg-red-100 text-red-700 border-red-300",
};

export const STATUS_BAR_COLOR = {
  正常: "bg-green-500",
  建議留意: "bg-amber-500",
  需立即更換: "bg-red-500",
};

// 數值化關鍵項目:填數值,自動判斷燈號與進度條
// min/max 用來把數值換算成「剩餘壽命」百分比,門檻可依店內經驗調整
export const QUANTIFIED_ITEMS = [
  {
    key: "battery",
    label: "電瓶健康度",
    unit: "%",
    fields: [{ key: "value", label: "健康度 (SOH)" }],
    min: 0,
    max: 100,
    computeStatus: (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      if (n >= 70) return "正常";
      if (n >= 40) return "建議留意";
      return "需立即更換";
    },
    computePercent: (v) => clamp(Number(v), 0, 100),
  },
  {
    key: "tire",
    label: "輪胎胎紋深度",
    unit: "mm",
    fields: [
      { key: "fl", label: "左前" },
      { key: "fr", label: "右前" },
      { key: "rl", label: "左後" },
      { key: "rr", label: "右後" },
    ],
    min: 1.6,
    max: 8,
    computeStatus: (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      if (n < 1.6) return "需立即更換";
      if (n < 3) return "建議留意";
      return "正常";
    },
    computePercent: (v) => clamp(((Number(v) - 1.6) / (8 - 1.6)) * 100, 0, 100),
  },
  {
    key: "brake",
    label: "煞車來令片厚度",
    unit: "mm",
    fields: [
      { key: "front", label: "前輪" },
      { key: "rear", label: "後輪" },
    ],
    min: 3,
    max: 10,
    computeStatus: (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const n = Number(v);
      if (n < 3) return "需立即更換";
      if (n < 5) return "建議留意";
      return "正常";
    },
    computePercent: (v) => clamp(((Number(v) - 3) / (10 - 3)) * 100, 0, 100),
  },
];

function clamp(n, min, max) {
  if (Number.isNaN(n)) return 0;
  return Math.min(max, Math.max(min, n));
}
