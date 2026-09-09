import { getSupabaseAdmin } from '@/lib/supabase/server';

export type SuggestionInput = {
  idea: string;
  target: string;
  note: string;
};

export async function saveSuggestion({ idea, target, note }: SuggestionInput) {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase 尚未配置。');
  const { error } = await client.from('test_suggestions').insert({
    idea,
    target,
    note,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function saveFeedback(message: string) {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase 尚未配置。');
  const { error } = await client.from('private_feedback').insert({
    message,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}
