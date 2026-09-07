import { env } from 'cloudflare:workers';
import { defaultEditableTests, sanitizeEditableTests, type EditableTest } from '@/lib/content';

type DatabaseBindings = { DB: D1Database };

async function getDatabase() {
  return (env as unknown as DatabaseBindings).DB;
}

export async function readEditableTests(): Promise<EditableTest[]> {
  const database = await getDatabase();
  const row = await database.prepare('SELECT value FROM site_content WHERE key = ?1').bind('homepage_tests').first<{ value: string }>();
  if (!row?.value) return defaultEditableTests;
  try {
    return sanitizeEditableTests(JSON.parse(row.value));
  } catch {
    return defaultEditableTests;
  }
}

export async function writeEditableTests(value: unknown) {
  const database = await getDatabase();
  const tests = sanitizeEditableTests(value);
  await database.prepare('INSERT INTO site_content (key, value, updated_at) VALUES (?1, ?2, ?3) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at')
    .bind('homepage_tests', JSON.stringify(tests), new Date().toISOString())
    .run();
  return tests;
}
