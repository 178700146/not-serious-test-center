import { env } from 'cloudflare:workers';

type DatabaseBindings = {
  DB: D1Database;
};

export type SuggestionInput = {
  idea: string;
  target: string;
  note: string;
};

const schemaStatement = `CREATE TABLE IF NOT EXISTS test_suggestions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  idea TEXT NOT NULL,
  target TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
)`;

let databaseReady: Promise<void> | undefined;

async function getDatabase() {
  const database = (env as unknown as DatabaseBindings).DB;
  if (!databaseReady) {
    databaseReady = database.prepare(schemaStatement).run().then(() => undefined);
  }
  await databaseReady;
  return database;
}

export async function saveSuggestion({ idea, target, note }: SuggestionInput) {
  const database = await getDatabase();
  await database
    .prepare('INSERT INTO test_suggestions (idea, target, note, created_at) VALUES (?, ?, ?, ?)')
    .bind(idea, target, note, new Date().toISOString())
    .run();
}

export async function saveFeedback(message: string) {
  const database = await getDatabase();
  await database
    .prepare('CREATE TABLE IF NOT EXISTS private_feedback (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT NOT NULL, created_at TEXT NOT NULL)')
    .run();
  await database
    .prepare('INSERT INTO private_feedback (message, created_at) VALUES (?, ?)')
    .bind(message, new Date().toISOString())
    .run();
}
