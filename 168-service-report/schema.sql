-- 168 汽車維修中心 電子檢測報告系統
-- 資料表結構

CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  plate VARCHAR(20) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  owner_name VARCHAR(100),
  car_model VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  mileage INTEGER,
  checklist JSONB NOT NULL,
  summary TEXT,
  technician VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_vehicle_id ON reports(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate);
