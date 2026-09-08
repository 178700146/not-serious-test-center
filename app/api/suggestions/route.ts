import { saveSuggestion } from '@/db/suggestions';

const clean = (value: unknown, limit: number) => typeof value === 'string' ? value.trim().slice(0, limit) : '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idea = clean(body.idea, 120);
    const target = clean(body.target, 80);
    const note = clean(body.note, 360);

    if (idea.length < 2 || target.length < 2) {
      return Response.json({ error: '请补全测试想法和想考考谁。' }, { status: 400 });
    }

    await saveSuggestion({ idea, target, note });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: '暂时收不到这条灵感。' }, { status: 500 });
  }
}
