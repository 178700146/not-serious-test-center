import { addReactionScore, getReactionLeaderboard } from '@/db/reaction-leaderboard';

export const runtime = 'nodejs';

const MIN_SCORE_MS = 100;
const MAX_SCORE_MS = 60_000;
const MAX_NICKNAME_LENGTH = 16;
type GameMode = 'basic' | 'advanced';
const recentSubmissions = new Map<string, number>();

function parseMode(value: unknown): GameMode | null {
  return value === 'advanced' || value === 'basic' ? value : null;
}

function cleanNickname(value: unknown) {
  if (typeof value !== 'string') return '';
  return value
    .split('')
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NICKNAME_LENGTH);
}

function isSafeNickname(value: string) {
  return value.length > 0 && !/(?:https?:\/\/|www\.|<|>|javascript:)/i.test(value);
}

function requesterKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

function json(value: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set('Cache-Control', 'no-store');
  return Response.json(value, { ...init, headers });
}

export async function GET(request: Request) {
  const mode = parseMode(new URL(request.url).searchParams.get('mode')) ?? 'basic';
  try {
    return json({ available: true, mode, entries: await getReactionLeaderboard(mode) });
  } catch {
    // The quiz remains playable when the optional Supabase table has not been applied yet.
    return json({ available: false, entries: [] });
  }
}

export async function POST(request: Request) {
  const key = requesterKey(request);
  const now = Date.now();
  const previous = recentSubmissions.get(key);
  if (previous && now - previous < 15_000) {
    return json({ error: '请稍等一会儿再提交。' }, { status: 429 });
  }

  try {
    const body = await request.json() as { nickname?: unknown; scoreMs?: unknown; mode?: unknown };
    const nickname = cleanNickname(body.nickname);
    const scoreMs = Number(body.scoreMs);
    const mode = parseMode(body.mode) ?? 'basic';
    if (!isSafeNickname(nickname) || !Number.isInteger(scoreMs) || scoreMs < MIN_SCORE_MS || scoreMs > MAX_SCORE_MS) {
      return json({ error: '昵称或成绩格式不正确。' }, { status: 400 });
    }

    recentSubmissions.set(key, now);
    await addReactionScore(nickname, scoreMs, mode);
    return json({ ok: true });
  } catch {
    return json({ error: '排行榜暂时休息，请稍后再试。' }, { status: 503 });
  }
}
