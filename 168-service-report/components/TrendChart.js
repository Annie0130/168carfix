// 輕量手刻 SVG 折線圖/長條圖,不需要額外的圖表套件
const WIDTH = 320;
const HEIGHT = 120;
const PAD = 24;

export default function TrendChart({ data, type = "line", color = "#3B5A73", unit = "" }) {
  if (!data || data.length === 0) return null;

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;

  const innerW = WIDTH - PAD * 2;
  const innerH = HEIGHT - PAD * 2;

  const points = data.map((d, i) => {
    const x = PAD + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
    const y = PAD + innerH - ((d.value - min) / range) * innerH;
    return { x, y, ...d };
  });

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full">
      {type === "bar" &&
        points.map((p, i) => {
          const barW = Math.min(28, innerW / data.length - 8);
          return (
            <rect
              key={i}
              x={p.x - barW / 2}
              y={p.y}
              width={barW}
              height={PAD + innerH - p.y}
              fill={color}
              opacity="0.8"
              rx="2"
            />
          );
        })}

      {type === "line" && (
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
      )}
      {type === "line" &&
        points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />)}

      {points.map((p, i) => (
        <text key={i} x={p.x} y={HEIGHT - 4} fontSize="8" textAnchor="middle" fill="#14181C" opacity="0.4">
          {p.label}
        </text>
      ))}
      {points.map((p, i) => (
        <text
          key={"v" + i}
          x={p.x}
          y={type === "bar" ? p.y - 4 : p.y - 8}
          fontSize="8"
          textAnchor="middle"
          fill="#14181C"
          opacity="0.6"
        >
          {p.value.toLocaleString()}{unit}
        </text>
      ))}
    </svg>
  );
}
