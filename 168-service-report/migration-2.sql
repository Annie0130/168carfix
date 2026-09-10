-- 階段 A 功能更新:數值化項目、耗材明細、下次保養提醒、車主確認、待修建議清單
-- 你的資料庫已經有 vehicles / reports 表了,在 Neon SQL Editor 執行這段就好
-- 用 ALTER TABLE 補欄位,不會刪除既有資料

ALTER TABLE reports ADD COLUMN IF NOT EXISTS quantified JSONB DEFAULT '{}'::jsonb;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS parts JSONB DEFAULT '[]'::jsonb;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS advisory_items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS next_service_mileage INTEGER;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS next_service_date DATE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS customer_approved BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS customer_approved_at TIMESTAMP;
