import crypto from "crypto";

const SECRET = process.env.SESSION_SECRET || "dev-secret-change-me";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

// ---- 店內共用後台登入 ----

export const ADMIN_COOKIE = "admin_session";

export function checkAdminPassword(username, password) {
  return (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  );
}

export function makeAdminSessionValue() {
  return sign("admin:" + process.env.ADMIN_PASSWORD);
}

export function isValidAdminSession(cookieValue) {
  if (!cookieValue) return false;
  return cookieValue === makeAdminSessionValue();
}

// 在 server component 裡呼叫,沒登入就導回登入頁
export function requireAdmin(cookieStore) {
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  return isValidAdminSession(value);
}

// ---- 客人依車牌查看報告 ----
// cookie 內容為 "<plate>.<簽章>",簽章證明是伺服器核發、沒被竄改

export function vehicleCookieName(plate) {
  return "vehicle_" + plate.toUpperCase();
}

export function makeVehicleSessionValue(plate) {
  const sig = sign("vehicle:" + plate.toUpperCase());
  return `${plate.toUpperCase()}.${sig}`;
}

export function isValidVehicleSession(plate, cookieValue) {
  if (!cookieValue) return false;
  const expected = makeVehicleSessionValue(plate);
  return cookieValue === expected;
}
