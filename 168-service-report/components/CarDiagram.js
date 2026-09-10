"use client";

import { useState } from "react";

const HOTSPOTS = [
  { id: "headlight", x: 46, y: 118, label: "頭燈 / 尾燈", desc: "頭燈、尾燈、方向燈等,確保夜間行車安全與其他用路人辨識。" },
  { id: "coolant", x: 70, y: 148, label: "冷卻系統", desc: "俗稱水箱精,幫引擎散熱、防止生鏽和結凍,不足或變質會導致引擎過熱。" },
  { id: "engine", x: 150, y: 82, label: "引擎室", desc: "引擎皮帶老化斷裂會導致發電機、冷氣壓縮機等多項功能失靈,是引擎室常見的檢測重點。" },
  { id: "battery", x: 205, y: 60, label: "電瓶", desc: "電瓶的健康狀態(SOH)數值越低代表越老化,太低可能會有發不動車的風險。" },
  { id: "front-wheel", x: 150, y: 172, label: "前輪", desc: "包含前輪胎紋深度(低於 1.6mm 需更換)與前煞車來令片厚度,是行車安全最關鍵的部位之一。" },
  { id: "chassis", x: 260, y: 182, label: "底盤 / 懸吊", desc: "支撐車身、吸收路面震動的機構,異音或鬆動會影響操控與舒適度。" },
  { id: "rear-wheel", x: 380, y: 172, label: "後輪", desc: "包含後輪胎紋深度與後煞車來令片厚度,建議定期檢查磨耗狀況。" },
];

const WHEEL_R = 34;
const BASE_Y = 172;

function wheelArch(cx) {
  const r = WHEEL_R + 8;
  return `M ${cx - r} ${BASE_Y} A ${r} ${r} 0 0 1 ${cx + r} ${BASE_Y}`;
}

export default function CarDiagram() {
  const [active, setActive] = useState(null);
  const activeSpot = HOTSPOTS.find((h) => h.id === active);

  return (
    <div className="no-print">
      <svg viewBox="0 0 500 230" className="w-full">
        <defs>
          <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E9E5DA" />
          </linearGradient>
        </defs>

        {/* 地面陰影 */}
        <ellipse cx="260" cy="208" rx="220" ry="10" fill="#14181C" opacity="0.08" />

        {/* 車身輪廓 */}
        <path
          d="M38,150
             C38,120 55,90 95,80
             L158,48
             C182,34 218,26 258,26
             L322,26
             C360,26 388,38 408,62
             L438,72
             C465,78 480,100 480,128
             L480,150
             Z"
          fill="url(#carBody)"
          stroke="#3B5A73"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <line x1="38" y1="150" x2="480" y2="150" stroke="#3B5A73" strokeWidth="3" />

        {/* 前後輪拱線 */}
        <path d={wheelArch(150)} fill="none" stroke="#3B5A73" strokeWidth="3" opacity="0.55" />
        <path d={wheelArch(380)} fill="none" stroke="#3B5A73" strokeWidth="3" opacity="0.55" />

        {/* 車窗 */}
        <path
          d="M168,50 L196,80 L392,80 L378,55 C348,44 320,38 280,38 L200,38 C190,40 178,44 168,50 Z"
          fill="#DCE7EE"
          stroke="#3B5A73"
          strokeWidth="1.5"
          opacity="0.9"
        />
        <line x1="285" y1="38" x2="290" y2="80" stroke="#3B5A73" strokeWidth="1.5" opacity="0.6" />

        {/* 後照鏡 */}
        <path d="M162,58 L148,52 L150,64 Z" fill="#3B5A73" />

        {/* 門線 */}
        <line x1="255" y1="30" x2="248" y2="150" stroke="#3B5A73" strokeWidth="1.5" opacity="0.35" />
        <line x1="330" y1="150" x2="345" y2="90" stroke="#3B5A73" strokeWidth="1.5" opacity="0.25" />

        {/* 把手 */}
        <rect x="215" y="95" width="22" height="5" rx="2.5" fill="#3B5A73" opacity="0.5" />
        <rect x="360" y="98" width="20" height="5" rx="2.5" fill="#3B5A73" opacity="0.5" />

        {/* 頭燈 / 尾燈 */}
        <ellipse cx="44" cy="122" rx="10" ry="14" fill="#E8A33D" stroke="#3B5A73" strokeWidth="1.5" />
        <rect x="468" y="98" width="10" height="20" rx="4" fill="#dc2626" opacity="0.85" />

        {/* 保險桿 */}
        <rect x="30" y="140" width="18" height="14" rx="4" fill="#1F2429" opacity="0.85" />
        <rect x="460" y="128" width="20" height="18" rx="4" fill="#1F2429" opacity="0.85" />

        {/* 車輪 */}
        {[150, 380].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy={BASE_Y} r={WHEEL_R} fill="#1F2429" />
            <circle cx={cx} cy={BASE_Y} r={WHEEL_R - 8} fill="#3A4048" />
            <circle cx={cx} cy={BASE_Y} r={11} fill="#DCE0E3" />
            <circle cx={cx} cy={BASE_Y} r={4} fill="#1F2429" />
          </g>
        ))}

        {/* 互動熱點 */}
        {HOTSPOTS.map((h) => (
          <g key={h.id} onClick={() => setActive(h.id)} className="cursor-pointer">
            <circle cx={h.x} cy={h.y} r={active === h.id ? 13 : 11} fill="white" opacity="0.9" />
            <circle
              cx={h.x}
              cy={h.y}
              r={active === h.id ? 13 : 11}
              fill={active === h.id ? "#E8A33D" : "#3B5A73"}
              fillOpacity={active === h.id ? 1 : 0.92}
              stroke="white"
              strokeWidth="2"
            />
            <text x={h.x} y={h.y + 4} fontSize="11" fontWeight="600" fill="white" textAnchor="middle" pointerEvents="none">
              ?
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-3 min-h-[56px] border border-line rounded-sm p-3 bg-paper/60">
        {activeSpot ? (
          <>
            <p className="text-sm font-medium text-ink mb-1">{activeSpot.label}</p>
            <p className="text-xs text-ink/60 leading-relaxed">{activeSpot.desc}</p>
          </>
        ) : (
          <p className="text-xs text-ink/40">點圖上的圓點,查看各部位說明</p>
        )}
      </div>
    </div>
  );
}
