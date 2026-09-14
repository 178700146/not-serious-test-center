import { getSupabaseAdmin } from '@/lib/supabase/server';

export type ReactionMode = 'basic' | 'advanced';

export type ReactionScore = {
  id: number;
  nickname: string;
  scoreMs: number;
  mode: ReactionMode;
  createdAt: string;
};

function database() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase 尚未配置。');
  return client;
}

export async function getReactionLeaderboard(mode: ReactionMode = 'basic'): Promise<ReactionScore[]> {
  const { data, error } = await database()
    .from('reaction_scores')
    .select('id,nickname,score_ms,mode,created_at')
    .eq('mode', mode)
    .order('score_ms', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) throw error;
  return (data ?? []).map((row) => {
    const item = row as { id: number; nickname: string; score_ms: number; mode: ReactionMode; created_at: string };
    return { id: item.id, nickname: item.nickname, scoreMs: item.score_ms, mode: item.mode, createdAt: item.created_at };
  });
}

export async function addReactionScore(nickname: string, scoreMs: number, mode: ReactionMode = 'basic') {
  const { error } = await database().from('reaction_scores').insert({ nickname, score_ms: scoreMs, mode });
  if (error) throw error;
}
