"use client";

import { useState } from "react";

const HOTSPOTS = [
  { id: "lights", x: 24, y: 78, label: "頭燈 / 尾燈", desc: "頭燈、尾燈、方向燈等,確保夜間行車安全與其他用路人辨識。" },
  { id: "coolant", x: 55, y: 95, label: "冷卻系統", desc: "俗稱水箱精,幫引擎散熱、防止生鏽和結凍,不足或變質會導致引擎過熱。" },
  { id: "engine", x: 110, y: 62, label: "引擎室", desc: "引擎皮帶老化斷裂會導致發電機、冷氣壓縮機等多項功能失靈,是引擎室常見的檢測重點。" },
  { id: "battery", x: 150, y: 80, label: "電瓶", desc: "電瓶的健康狀態(SOH)數值越低代表越老化,太低可能會有發不動車的風險。" },
  { id: "front-wheel", x: 115, y: 150, label: "前輪", desc: "包含前輪胎紋深度(低於 1.6mm 需更換)與前煞車來令片厚度,是行車安全最關鍵的部位之一。" },
  { id: "chassis", x: 220, y: 165, label: "底盤 / 懸吊", desc: "支撐車身、吸收路面震動的機構,異音或鬆動會影響操控與舒適度。" },
  { id: "rear-wheel", x: 320, y: 150, label: "後輪", desc: "包含後輪胎紋深度與後煞車來令片厚度,建議定期檢查磨耗狀況。" },
];

export default function CarDiagram() {
  const [active, setActive] = useState(null);
  const activeSpot = HOTSPOTS.find((h) => h.id === active);

  return (
    <div className="no-print">
      <svg viewBox="0 0 400 190" className="w-full">
        {/* 車身輪廓(簡化側視圖) */}
        <path
          d="M20,115 C20,90 35,70 60,65 L120,50 C140,45 160,45 180,50 L330,60
             C355,63 370,80 372,100 L372,115 Z"
          fill="#F7F5F1"
          stroke="#3B5A73"
          strokeWidth="2.5"
        />
        <line x1="20" y1="115" x2="372" y2="115" stroke="#3B5A73" strokeWidth="2.5" />
        {/* 車窗線 */}
        <path d="M130,52 L150,68 L250,68 L235,54" fill="none" stroke="#3B5A73" strokeWidth="1.5" opacity="0.5" />
        {/* 車輪 */}
        <circle cx="115" cy="150" r="30" fill="#1F2429" />
        <circle cx="115" cy="150" r="12" fill="#F7F5F1" />
        <circle cx="320" cy="150" r="30" fill="#1F2429" />
        <circle cx="320" cy="150" r="12" fill="#F7F5F1" />

        {HOTSPOTS.map((h) => (
          <g key={h.id} onClick={() => setActive(h.id)} className="cursor-pointer">
            <circle
              cx={h.x}
              cy={h.y}
              r={active === h.id ? 11 : 9}
              fill={active === h.id ? "#E8A33D" : "#3B5A73"}
              stroke="white"
              strokeWidth="2"
            />
            <text x={h.x} y={h.y + 3.5} fontSize="9" fill="white" textAnchor="middle" pointerEvents="none">
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
          <p className="text-xs text-ink/40">點圖上的橘色圓點,查看各部位說明</p>
        )}
      </div>
    </div>
  );
}
