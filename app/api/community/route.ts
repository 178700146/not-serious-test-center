import { addComment, getCommunity, toggleCommentReaction, toggleTestReaction } from '@/db/community';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Reaction = 'like' | 'favorite';

const quizNames = new Set([
  '蘑菇大师',
  '观鸟大师',
  '鸟鸣识别',
  '奥特曼认脸局',
  '奥特曼听声局',
  '宝可梦剪影局',
  '方言捕手',
  '外语猜国家',
  '昆虫侦探',
  '反应速度局',
]);

const clean = (value: unknown, limit: number) =>
  typeof value === 'string' ? value.trim().slice(0, limit) : '';
const reaction = (value: unknown): Reaction | null =>
  value === 'like' || value === 'favorite' ? value : null;
const validVisitor = (value: unknown) => {
  const visitorId = clean(value, 80);
  return visitorId.length >= 8 ? visitorId : '';
};
const validQuiz = (value: unknown) => {
  const quizName = clean(value, 30);
  return quizNames.has(quizName) ? quizName : '';
};

function failureResponse(error: unknown, operation: 'load' | 'save') {
  const detail = error instanceof Error ? error.message : String(error);
  console.error(`[community:${operation}]`, detail);

  if (detail.includes('Supabase 尚未配置')) {
    return Response.json(
      { error: 'community_unavailable', message: '讨论区暂时未连接数据库，请管理员检查线上项目的 Supabase 配置。' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  if (/PGRST205|relation .* does not exist|Could not find the table/i.test(detail)) {
    return Response.json(
      { error: 'community_schema', message: '讨论区数据库还没有完成初始化，请管理员应用社区迁移。' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return Response.json(
    { error: operation === 'load' ? 'load failed' : 'save failed', message: '讨论区暂时不可用，请稍后再试。' },
    { status: 500, headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const quizName = validQuiz(params.get('quiz'));
  const visitorId = validVisitor(params.get('visitor'));
  if (!quizName || !visitorId) {
    return Response.json({ error: 'invalid request' }, { status: 400 });
  }

  try {
    return Response.json(await getCommunity(quizName, visitorId), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return failureResponse(error, 'load');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const quizName = validQuiz(body.quizName);
    const visitorId = validVisitor(body.visitorId);
    if (!quizName || !visitorId) {
      return Response.json({ error: 'invalid request' }, { status: 400 });
    }

    if (body.kind === 'test_reaction') {
      const value = reaction(body.reaction);
      if (!value) return Response.json({ error: 'invalid reaction' }, { status: 400 });
      await toggleTestReaction(quizName, visitorId, value);
    } else if (body.kind === 'comment_reaction') {
      const value = reaction(body.reaction);
      const commentId = Number(body.commentId);
      if (!value || !Number.isInteger(commentId) || commentId < 1) {
        return Response.json({ error: 'invalid reaction' }, { status: 400 });
      }
      await toggleCommentReaction(quizName, visitorId, commentId, value);
    } else if (body.kind === 'comment') {
      const content = clean(body.content, 500);
      const nickname = clean(body.nickname, 20);
      const rawParent = body.parentId == null ? null : Number(body.parentId);
      if (content.length < 2 || (rawParent !== null && (!Number.isInteger(rawParent) || rawParent < 1))) {
        return Response.json({ error: 'invalid comment' }, { status: 400 });
      }
      await addComment(quizName, visitorId, nickname, content, rawParent);
    } else {
      return Response.json({ error: 'invalid request' }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return failureResponse(error, 'save');
  }
}
