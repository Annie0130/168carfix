// 執行方式: npm run db:init
// 需要先在 .env / Vercel 環境變數中設定好 POSTGRES_URL
import { sql } from "@vercel/postgres";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(path.join(__dirname, "..", "schema.sql"), "utf8");

const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  console.log("已執行:", statement.split("\n")[0]);
}

console.log("資料庫初始化完成 ✅");
process.exit(0);
