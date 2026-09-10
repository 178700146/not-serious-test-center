import { addComment, getCommunity, toggleCommentReaction, toggleTestReaction } from '@/db/community';

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

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const quizName = validQuiz(params.get('quiz'));
  const visitorId = validVisitor(params.get('visitor'));
  if (!quizName || !visitorId) {
    return Response.json({ error: 'invalid request' }, { status: 400 });
  }

  try {
    return Response.json(await getCommunity(quizName, visitorId));
  } catch {
    return Response.json({ error: 'load failed' }, { status: 500 });
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
      const rawParent = body.parentId === null ? null : Number(body.parentId);
      if (content.length < 2 || (rawParent !== null && (!Number.isInteger(rawParent) || rawParent < 1))) {
        return Response.json({ error: 'invalid comment' }, { status: 400 });
      }
      await addComment(quizName, visitorId, nickname, content, rawParent);
    } else {
      return Response.json({ error: 'invalid request' }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'save failed' }, { status: 500 });
  }
}
