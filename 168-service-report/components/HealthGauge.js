function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy - r * Math.sin(angleRad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = Math.abs(startAngle - endAngle) <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function scoreToAngle(v) {
  return 180 - (v / 100) * 180;
}

export default function HealthGauge({ score, label, color }) {
  const cx = 110;
  const cy = 100;
  const r = 85;
  const needleAngle = scoreToAngle(score);
  const needleTip = polarToCartesian(cx, cy, r - 18, needleAngle);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 115" className="w-56">
        <path d={describeArc(cx, cy, r, 180, 81)} stroke="#dc2626" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={describeArc(cx, cy, r, 81, 36)} stroke="#f59e0b" strokeWidth="14" fill="none" strokeLinecap="round" />
        <path d={describeArc(cx, cy, r, 36, 0)} stroke="#16a34a" strokeWidth="14" fill="none" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={needleTip.x} y2={needleTip.y} stroke="#14181C" strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="6" fill="#14181C" />
      </svg>
      <p className="font-display text-4xl font-semibold -mt-2" style={{ color }}>
        {score}
        <span className="text-base text-ink/40 font-body ml-1">分</span>
      </p>
      <p className="text-sm mt-0.5" style={{ color }}>{label}</p>
    </div>
  );
}
