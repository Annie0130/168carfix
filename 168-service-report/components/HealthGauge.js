// 角度定義:-90 = 左端(0分),0 = 正上方,90 = 右端(100分)
// 這是業界常見、經過驗證的指針表算法(clock-style angle)
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function scoreToAngle(v) {
  return -90 + (v / 100) * 180;
}

export default function HealthGauge({ score, label, color }) {
  const cx = 130;
  const cy = 110;
  const r = 90;

  const needleAngle = scoreToAngle(score);
  const needleTip = polarToCartesian(cx, cy, r - 20, needleAngle);

  const zeroLabelPos = polarToCartesian(cx, cy, r + 16, -90);
  const hundredLabelPos = polarToCartesian(cx, cy, r + 16, 90);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 260 135" className="w-64">
        {/* 三段顏色區間:紅(0-55) 黃(55-80) 綠(80-100) */}
        <path d={describeArc(cx, cy, r, -90, 9)} stroke="#dc2626" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={describeArc(cx, cy, r, 9, 54)} stroke="#f59e0b" strokeWidth="16" fill="none" strokeLinecap="round" />
        <path d={describeArc(cx, cy, r, 54, 90)} stroke="#16a34a" strokeWidth="16" fill="none" strokeLinecap="round" />

        {/* 刻度文字 */}
        <text x={zeroLabelPos.x} y={zeroLabelPos.y + 4} fontSize="11" fill="#14181C" opacity="0.4" textAnchor="middle">0</text>
        <text x={hundredLabelPos.x} y={hundredLabelPos.y + 4} fontSize="11" fill="#14181C" opacity="0.4" textAnchor="middle">100</text>

        {/* 指針 */}
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#14181C" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="7" fill="#14181C" />
      </svg>

      <p className="font-display text-4xl font-semibold -mt-2" style={{ color }}>
        {score}
        <span className="text-base text-ink/40 font-body ml-1">分</span>
      </p>
      <p className="text-sm mt-0.5" style={{ color }}>愛車健康度 · {label}</p>
    </div>
  );
}
