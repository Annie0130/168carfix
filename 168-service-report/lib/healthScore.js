// 把檢測項目狀態 + 數值化項目,換算成一個 0-100 的「愛車健康度」總分
const STATUS_POINTS = {
  正常: 100,
  建議留意: 55,
  需立即更換: 15,
};

export function computeHealthScore(checklist = [], quantified = {}) {
  const points = [];

  for (const row of checklist) {
    if (STATUS_POINTS[row.status] !== undefined) {
      points.push(STATUS_POINTS[row.status]);
    }
  }

  for (const status of Object.values(quantified)) {
    if (status && STATUS_POINTS[status] !== undefined) {
      points.push(STATUS_POINTS[status]);
    }
  }

  if (points.length === 0) return null;

  const avg = points.reduce((a, b) => a + b, 0) / points.length;
  const score = Math.round(avg);

  let label, color;
  if (score >= 80) {
    label = "狀況良好";
    color = "#16a34a";
  } else if (score >= 55) {
    label = "建議留意";
    color = "#f59e0b";
  } else {
    label = "建議盡快處理";
    color = "#dc2626";
  }

  return { score, label, color };
}
