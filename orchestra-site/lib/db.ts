import path from "node:path";
import Database from "better-sqlite3";
import type { Database as DatabaseType, Statement } from "better-sqlite3";

/**
 * SQLite-backed waitlist store (better-sqlite3).
 *
 * - File-backed in normal runs (persists across restarts — AC10);
 *   in-memory under NODE_ENV=test so tests are isolated.
 * - A UNIQUE index on the normalized (trim + lowercase) email lets the DB
 *   itself enforce dedupe (AC5/AC7/AC8) — even against rapid double-submits.
 * - Parameterized statements only; never interpolate user input into SQL.
 * - A global singleton keeps Next.js dev hot-reload from reopening the DB.
 */

type WaitlistStore = {
  readonly db: DatabaseType;
  readonly insert: Statement<[string, string]>;
  readonly count: Statement<[]>;
  readonly clear: Statement<[]>;
  readonly clearSeq: Statement<[]>;
};

type CountRow = { readonly c: number };

const globalForDb = globalThis as unknown as {
  __waitlistStore?: WaitlistStore;
};

function isTestEnv(): boolean {
  return process.env.NODE_ENV === "test";
}

function resolveDatabaseFile(): string {
  return isTestEnv() ? ":memory:" : path.join(process.cwd(), "waitlist.db");
}

function createStore(): WaitlistStore {
  const db = new Database(resolveDatabaseFile());

  // Durability + sane concurrency for the file-backed case.
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL,
      created_at TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_waitlist_email_normalized
      ON waitlist (lower(trim(email)));
  `);

  return {
    db,
    insert: db.prepare("INSERT INTO waitlist (email, created_at) VALUES (?, ?)"),
    count: db.prepare("SELECT COUNT(*) AS c FROM waitlist"),
    clear: db.prepare("DELETE FROM waitlist"),
    clearSeq: db.prepare("DELETE FROM sqlite_sequence WHERE name = 'waitlist'"),
  };
}

function getStore(): WaitlistStore {
  if (!globalForDb.__waitlistStore) {
    globalForDb.__waitlistStore = createStore();
  }
  return globalForDb.__waitlistStore;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Error &&
    /UNIQUE constraint failed/i.test(error.message)
  );
}

/**
 * Insert a new email and return its place in line.
 *
 * The email is normalized (trim + lowercase) before insert/compare. Because
 * rows are never deleted, the new total count is also this email's 1-based
 * position. Insert + count run in a single synchronous transaction so the
 * returned count always reflects the row just added.
 *
 * @throws Error('DUP') when the (normalized) email is already on the list.
 */
export function addEmail(email: string): { position: number; count: number } {
  const normalized = normalizeEmail(email);
  const store = getStore();
  const createdAt = new Date().toISOString();

  const run = store.db.transaction((value: string, timestamp: string) => {
    store.insert.run(value, timestamp);
    const { c } = store.count.get() as CountRow;
    return c;
  });

  try {
    const count = run(normalized, createdAt);
    return { position: count, count };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error("DUP");
    }
    throw error;
  }
}

/** Current total number of emails on the waitlist. */
export function getCount(): number {
  const { c } = getStore().count.get() as CountRow;
  return c;
}

/** Test-only helper: wipe all rows and reset autoincrement. */
export function _reset(): void {
  const store = getStore();
  const run = store.db.transaction(() => {
    store.clear.run();
    store.clearSeq.run();
  });
  run();
}
