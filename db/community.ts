import { getSupabaseAdmin } from '@/lib/supabase/server';

type Reaction = 'like' | 'favorite';

type CommentRow = {
  id: number;
  parent_id: number | null;
  nickname: string;
  content: string;
  created_at: string;
};

type CommentReactionRow = {
  comment_id: number;
  visitor_id: string;
  reaction: Reaction;
};

function database() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Supabase 尚未配置。');
  return client;
}

export async function getCommunity(quizName: string, visitorId: string) {
  const client = database();
  const [testResult, viewerResult, commentsResult] = await Promise.all([
    client.from('test_reactions').select('reaction').eq('quiz_name', quizName),
    client.from('test_reactions').select('reaction').eq('quiz_name', quizName).eq('visitor_id', visitorId),
    client
      .from('quiz_comments')
      .select('id,parent_id,nickname,content,created_at')
      .eq('quiz_name', quizName)
      .order('created_at', { ascending: false })
      .limit(100),
  ]);

  if (testResult.error) throw testResult.error;
  if (viewerResult.error) throw viewerResult.error;
  if (commentsResult.error) throw commentsResult.error;

  const comments = (commentsResult.data ?? []) as CommentRow[];
  const commentIds = comments.map((comment) => comment.id);
  const commentReactionResult = commentIds.length
    ? await client
        .from('comment_reactions')
        .select('comment_id,visitor_id,reaction')
        .in('comment_id', commentIds)
    : { data: [] as CommentReactionRow[], error: null };
  if (commentReactionResult.error) throw commentReactionResult.error;

  const testTotals = { like: 0, favorite: 0 };
  for (const row of (testResult.data ?? []) as { reaction: Reaction }[]) {
    if (row.reaction === 'like' || row.reaction === 'favorite') testTotals[row.reaction] += 1;
  }
  const viewerTest = new Set((viewerResult.data ?? []).map((row) => row.reaction));
  const reactionRows = (commentReactionResult.data ?? []) as CommentReactionRow[];

  return {
    test: {
      likes: testTotals.like,
      favorites: testTotals.favorite,
      viewerLikes: viewerTest.has('like'),
      viewerFavorites: viewerTest.has('favorite'),
    },
    comments: comments.map((comment) => {
      const reactions = reactionRows.filter((row) => row.comment_id === comment.id);
      return {
        id: comment.id,
        parentId: comment.parent_id,
        nickname: comment.nickname,
        content: comment.content,
        createdAt: comment.created_at,
        likes: reactions.filter((row) => row.reaction === 'like').length,
        favorites: reactions.filter((row) => row.reaction === 'favorite').length,
        viewerLikes: reactions.some((row) => row.visitor_id === visitorId && row.reaction === 'like'),
        viewerFavorites: reactions.some((row) => row.visitor_id === visitorId && row.reaction === 'favorite'),
      };
    }),
  };
}

export async function toggleTestReaction(quizName: string, visitorId: string, reaction: Reaction) {
  const client = database();
  const key = { quiz_name: quizName, visitor_id: visitorId, reaction };
  const existing = await client
    .from('test_reactions')
    .select('quiz_name')
    .match(key)
    .maybeSingle();
  if (existing.error) throw existing.error;
  const result = existing.data
    ? await client.from('test_reactions').delete().match(key)
    : await client.from('test_reactions').insert(key);
  if (result.error) throw result.error;
}

export async function toggleCommentReaction(quizName: string, visitorId: string, commentId: number, reaction: Reaction) {
  const client = database();
  const comment = await client
    .from('quiz_comments')
    .select('id')
    .eq('id', commentId)
    .eq('quiz_name', quizName)
    .maybeSingle();
  if (comment.error) throw comment.error;
  if (!comment.data) throw new Error('评论不存在。');

  const key = { comment_id: commentId, visitor_id: visitorId, reaction };
  const existing = await client.from('comment_reactions').select('comment_id').match(key).maybeSingle();
  if (existing.error) throw existing.error;
  const result = existing.data
    ? await client.from('comment_reactions').delete().match(key)
    : await client.from('comment_reactions').insert(key);
  if (result.error) throw result.error;
}

export async function addComment(quizName: string, visitorId: string, nickname: string, content: string, parentId: number | null) {
  const client = database();
  if (parentId !== null) {
    const parent = await client
      .from('quiz_comments')
      .select('id')
      .eq('id', parentId)
      .eq('quiz_name', quizName)
      .maybeSingle();
    if (parent.error) throw parent.error;
    if (!parent.data) throw new Error('被回复的评论不存在。');
  }

  const result = await client.from('quiz_comments').insert({
    quiz_name: quizName,
    parent_id: parentId,
    visitor_id: visitorId,
    nickname: nickname || '匿名访客',
    content,
  });
  if (result.error) throw result.error;
}
