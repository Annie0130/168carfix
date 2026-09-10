// 車輛示意圖的部位資料,和「檢測項目」清單共用,做到雙向連動
export const HOTSPOTS = [
  { id: "headlight", side: "left", x: 46, y: 118, label: "頭燈 / 尾燈", desc: "頭燈、尾燈、方向燈等,確保夜間行車安全與其他用路人辨識。" },
  { id: "coolant", side: "left", x: 70, y: 148, label: "冷卻系統", desc: "俗稱水箱精,幫引擎散熱、防止生鏽和結凍,不足或變質會導致引擎過熱。" },
  { id: "engine", side: "left", x: 150, y: 82, label: "引擎室", desc: "包含引擎皮帶、煞車油壺等,老化或變質會導致多項功能失靈,是常見的檢測重點。" },
  { id: "front-wheel", side: "left", x: 150, y: 172, label: "前輪", desc: "包含前輪胎紋深度(低於 1.6mm 需更換)與前煞車來令片厚度,是行車安全最關鍵的部位之一。" },
  { id: "battery", side: "right", x: 205, y: 60, label: "電瓶", desc: "電瓶的健康狀態(SOH)數值越低代表越老化,太低可能會有發不動車的風險。" },
  { id: "chassis", side: "right", x: 260, y: 182, label: "底盤 / 懸吊", desc: "支撐車身、吸收路面震動的機構,異音或鬆動會影響操控與舒適度。" },
  { id: "rear-wheel", side: "right", x: 380, y: 172, label: "後輪", desc: "包含後輪胎紋深度與後煞車來令片厚度,建議定期檢查磨耗狀況。" },
];

// 檢測項目名稱 -> 對應的車輛部位 id(沒有對應到的項目就不會有連動效果)
export const CHECKLIST_TO_HOTSPOT = {
  "煞車油": "engine",
  "冷卻液": "coolant",
  "輪胎胎壓": "front-wheel",
  "引擎皮帶": "engine",
  "前後燈光": "headlight",
  "底盤 / 懸吊": "chassis",
  "變速箱油": "engine",
};
