"use client";

import { HOTSPOTS } from "@/lib/carHotspots";

const SHIFT_X = 120;
const LEFT_YS = [40, 92, 144, 196];
const RIGHT_YS = [55, 120, 185];
const WHEEL_R = 34;
const BASE_Y = 172;

function wheelArch(cx) {
  const r = WHEEL_R + 8;
  return `M ${cx - r} ${BASE_Y} A ${r} ${r} 0 0 1 ${cx + r} ${BASE_Y}`;
}

// active: 目前高亮的 hotspot id, onSelect(id): 點了標籤或部位時呼叫
export default function CarDiagram({ active, onSelect }) {
  const leftHotspots = HOTSPOTS.filter((h) => h.side === "left");
  const rightHotspots = HOTSPOTS.filter((h) => h.side === "right");

  function renderChip(h, idx, side) {
    const isActive = active === h.id;
    const chipY = side === "left" ? LEFT_YS[idx] : RIGHT_YS[idx];
    const chipX = side === "left" ? 8 : 552;
    const chipW = 140;
    const chipH = 28;
    const hx = h.x + SHIFT_X;
    const hy = h.y;
    const lineStartX = side === "left" ? chipX + chipW : chipX;

    return (
      <g key={h.id} className="cursor-pointer" onClick={() => onSelect(h.id)}>
        <line
          x1={lineStartX}
          y1={chipY}
          x2={hx}
          y2={hy}
          stroke={isActive ? "#E8A33D" : "#3B5A73"}
          strokeWidth={isActive ? 2 : 1}
          opacity={isActive ? 0.9 : 0.35}
        />
        <rect
          x={chipX}
          y={chipY - chipH / 2}
          width={chipW}
          height={chipH}
          rx="6"
          fill={isActive ? "#E8A33D" : "white"}
          stroke={isActive ? "#E8A33D" : "#3B5A73"}
          strokeWidth="1.5"
          opacity={isActive ? 1 : 0.85}
        />
        <text
          x={chipX + chipW / 2}
          y={chipY + 4}
          fontSize="11"
          fontWeight="600"
          textAnchor="middle"
          fill={isActive ? "white" : "#14181C"}
        >
          {h.label}
        </text>
        <circle cx={hx} cy={hy} r={isActive ? 7 : 5} fill={isActive ? "#E8A33D" : "#3B5A73"} stroke="white" strokeWidth="1.5" />
      </g>
    );
  }

  return (
    <svg viewBox="0 0 700 235" className="w-full">
      <defs>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E9E5DA" />
        </linearGradient>
      </defs>

      {/* 地面陰影 */}
      <ellipse cx="380" cy="208" rx="220" ry="10" fill="#14181C" opacity="0.08" />

      {/* 車身輪廓 */}
      <path
        d="M158,150
           C158,120 175,90 215,80
           L278,48
           C302,34 338,26 378,26
           L442,26
           C480,26 508,38 528,62
           L558,72
           C585,78 600,100 600,128
           L600,150
           Z"
        fill="url(#carBody)"
        stroke="#3B5A73"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <line x1="158" y1="150" x2="600" y2="150" stroke="#3B5A73" strokeWidth="3" />

      {/* 前後輪拱線 */}
      <path d={wheelArch(270)} fill="none" stroke="#3B5A73" strokeWidth="3" opacity="0.55" />
      <path d={wheelArch(500)} fill="none" stroke="#3B5A73" strokeWidth="3" opacity="0.55" />

      {/* 車窗 */}
      <path
        d="M288,50 L316,80 L512,80 L498,55 C468,44 440,38 400,38 L320,38 C310,40 298,44 288,50 Z"
        fill="#DCE7EE"
        stroke="#3B5A73"
        strokeWidth="1.5"
        opacity="0.9"
      />
      <line x1="405" y1="38" x2="410" y2="80" stroke="#3B5A73" strokeWidth="1.5" opacity="0.6" />

      {/* 後照鏡 */}
      <path d="M282,58 L268,52 L270,64 Z" fill="#3B5A73" />

      {/* 門線 */}
      <line x1="375" y1="30" x2="368" y2="150" stroke="#3B5A73" strokeWidth="1.5" opacity="0.35" />
      <line x1="450" y1="150" x2="465" y2="90" stroke="#3B5A73" strokeWidth="1.5" opacity="0.25" />

      {/* 把手 */}
      <rect x="335" y="95" width="22" height="5" rx="2.5" fill="#3B5A73" opacity="0.5" />
      <rect x="480" y="98" width="20" height="5" rx="2.5" fill="#3B5A73" opacity="0.5" />

      {/* 頭燈 / 尾燈 */}
      <ellipse cx="164" cy="122" rx="10" ry="14" fill="#E8A33D" stroke="#3B5A73" strokeWidth="1.5" />
      <rect x="588" y="98" width="10" height="20" rx="4" fill="#dc2626" opacity="0.85" />

      {/* 保險桿 */}
      <rect x="150" y="140" width="18" height="14" rx="4" fill="#1F2429" opacity="0.85" />
      <rect x="580" y="128" width="20" height="18" rx="4" fill="#1F2429" opacity="0.85" />

      {/* 車輪 */}
      {[270, 500].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={BASE_Y} r={WHEEL_R} fill="#1F2429" />
          <circle cx={cx} cy={BASE_Y} r={WHEEL_R - 8} fill="#3A4048" />
          <circle cx={cx} cy={BASE_Y} r={11} fill="#DCE0E3" />
          <circle cx={cx} cy={BASE_Y} r={4} fill="#1F2429" />
        </g>
      ))}

      {/* 常駐標籤 + 連接線(左右兩側) */}
      {leftHotspots.map((h, i) => renderChip(h, i, "left"))}
      {rightHotspots.map((h, i) => renderChip(h, i, "right"))}
    </svg>
  );
}
