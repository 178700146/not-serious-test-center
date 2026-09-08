import { saveFeedback } from '@/db/suggestions';

const clean = (value: unknown) => typeof value === 'string' ? value.trim().slice(0, 600) : '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = clean(body.message);

    if (message.length < 2) {
      return Response.json({ error: '请写一点意见。' }, { status: 400 });
    }

    await saveFeedback(message);
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: '暂时收不到这条意见。' }, { status: 500 });
  }
}
