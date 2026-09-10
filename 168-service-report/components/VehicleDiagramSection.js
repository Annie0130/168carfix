"use client";

import { useState, useRef } from "react";
import CarDiagram from "@/components/CarDiagram";
import StatusBadge from "@/components/StatusBadge";
import HelpTooltip from "@/components/HelpTooltip";
import { HOTSPOTS, CHECKLIST_TO_HOTSPOT } from "@/lib/carHotspots";
import { GLOSSARY } from "@/lib/glossary";

// 車輛示意圖 + 檢測項目清單,兩邊互相連動(點一邊,另一邊自動捲動並高亮)
export default function VehicleDiagramSection({ checklist }) {
  const [active, setActive] = useState(null);
  const diagramRef = useRef(null);
  const rowRefs = useRef({});

  const activeSpot = HOTSPOTS.find((h) => h.id === active);

  function selectFromDiagram(id) {
    setActive(id);
    const itemName = Object.keys(CHECKLIST_TO_HOTSPOT).find((k) => CHECKLIST_TO_HOTSPOT[k] === id);
    if (itemName && rowRefs.current[itemName]) {
      rowRefs.current[itemName].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function selectFromChecklist(itemName) {
    const hotspotId = CHECKLIST_TO_HOTSPOT[itemName];
    if (!hotspotId) return;
    setActive(hotspotId);
    diagramRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <section ref={diagramRef} className="no-print">
        <h2 className="font-display text-lg text-ink mb-3">車輛部位說明</h2>
        <p className="text-xs text-ink/40 mb-2">點圖上的標籤,或下方檢測項目,兩邊會互相對照</p>
        <CarDiagram active={active} onSelect={selectFromDiagram} />
        <div className="mt-3 min-h-[56px] border border-line rounded-sm p-3 bg-paper/60">
          {activeSpot ? (
            <>
              <p className="text-sm font-medium text-ink mb-1">{activeSpot.label}</p>
              <p className="text-xs text-ink/60 leading-relaxed">{activeSpot.desc}</p>
            </>
          ) : (
            <p className="text-xs text-ink/40">點圖上的標籤,查看各部位說明</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-lg text-ink mb-3">檢測項目</h2>
        <table className="w-full text-sm border-t border-line">
          <tbody>
            {checklist.map((row, i) => {
              const hotspotId = CHECKLIST_TO_HOTSPOT[row.item];
              const clickable = !!hotspotId;
              const isActiveRow = active && hotspotId === active;
              return (
                <tr
                  key={i}
                  ref={(el) => {
                    if (el) rowRefs.current[row.item] = el;
                  }}
                  onClick={clickable ? () => selectFromChecklist(row.item) : undefined}
                  className={`border-b border-line transition-colors ${
                    clickable ? "cursor-pointer hover:bg-paper/60 no-print:cursor-auto" : ""
                  } ${isActiveRow ? "bg-amber-50" : ""}`}
                >
                  <td className="py-2 pr-3 text-ink align-top">
                    {row.item}
                    {clickable && <span className="text-steel text-[10px] ml-1">📍</span>}
                    <HelpTooltip text={GLOSSARY[row.item]} />
                  </td>
                  <td className="py-2 pr-3 align-top whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="py-2 text-ink/50 align-top">{row.note}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
