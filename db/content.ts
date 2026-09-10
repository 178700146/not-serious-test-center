import { defaultEditableTests, sanitizeEditableTests, type EditableTest } from '@/lib/content';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function readEditableTests(): Promise<EditableTest[]> {
  const client = getSupabaseAdmin();
  if (!client) return defaultEditableTests;
  const { data, error } = await client
    .from('site_content')
    .select('value')
    .eq('key', 'homepage_tests')
    .maybeSingle<{ value: unknown }>();
  if (error || !data?.value) return defaultEditableTests;
  return sanitizeEditableTests(typeof data.value === 'string' ? JSON.parse(data.value) : data.value);
}

export async function writeEditableTests(value: unknown) {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase 尚未配置。');
  const tests = sanitizeEditableTests(value);
  const { error } = await client.from('site_content').upsert({
    key: 'homepage_tests',
    value: tests,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
  return tests;
}
