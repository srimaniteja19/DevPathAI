import Database from "better-sqlite3";
import path from "node:path";

const dbPath = path.join(process.cwd(), "devpath.sqlite");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS saved_courses (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  name TEXT,
  payload_json TEXT NOT NULL
);
`);

export { db };

