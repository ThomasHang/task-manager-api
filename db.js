// db.js
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

// ✅ ES Module 中要手动定义 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 设置数据库文件路径
const file = path.join(__dirname, "db.json");
const adapter = new JSONFile(file);
const defaultData = { users: [], tasks: [] };
//  lowdb 新版要求初始化 Low 时必须传入 defaultData，否则会报 missing default data 错误。
const db = new Low(adapter, defaultData); // 传入 defaultData

// ✅ 初始化数据结构
async function initDB() {
  await db.read();
  db.data ||= { users: [], tasks: [] };
  await db.write();
}

export { db, initDB };
