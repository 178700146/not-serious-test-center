import { getSupabaseAdmin } from '@/lib/supabase/server';

export type SiteMetrics = {
  comments: number;
  suggestions: number;
  feedback: number;
  reactionScores: number;
  testReactions: number;
  commentReactions: number;
};

export async function readSiteMetrics(): Promise<SiteMetrics> {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase 尚未配置。');
  const tables = [
    ['comments', 'quiz_comments'],
    ['suggestions', 'test_suggestions'],
    ['feedback', 'private_feedback'],
    ['reactionScores', 'reaction_scores'],
    ['testReactions', 'test_reactions'],
    ['commentReactions', 'comment_reactions'],
  ] as const;
  const results = await Promise.all(
    tables.map(async ([key, table]) => {
      const result = await client.from(table).select('*', { count: 'exact', head: true });
      if (result.error) throw result.error;
      return [key, result.count ?? 0] as const;
    }),
  );
  return Object.fromEntries(results) as SiteMetrics;
}
