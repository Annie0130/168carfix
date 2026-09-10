-- 階段 A2:廠內看板 + 車主進度追蹤頁
-- 在 Neon SQL Editor 執行,只會新增欄位,不影響現有資料

ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS status VARCHAR(30);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP DEFAULT NOW();
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS assigned_technician VARCHAR(100);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS estimated_completion TIMESTAMP;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS same_day_pickup BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS customer_waiting BOOLEAN NOT NULL DEFAULT FALSE;

-- 之後新增的車輛,如果沒指定狀態,會自動進「待檢測」欄位(自動上看板)
-- 現有車輛保持沒有狀態(不會突然全部塞滿看板)
ALTER TABLE vehicles ALTER COLUMN status SET DEFAULT '待檢測';
