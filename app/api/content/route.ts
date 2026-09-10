import { readEditableTests, writeEditableTests } from '@/db/content';

export async function GET() {
  try {
    return Response.json({ tests: await readEditableTests() });
  } catch {
    return Response.json({ tests: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const expectedPin = (process.env.ADMIN_PIN ?? '').trim();
  const providedPin = request.headers.get('x-admin-pin')?.trim() ?? '';
  if (!expectedPin || providedPin !== expectedPin) {
    return Response.json({ error: '管理口令不正确。' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tests = await writeEditableTests(body.tests);
    return Response.json({ ok: true, tests });
  } catch {
    return Response.json({ error: '保存失败，请稍后再试。' }, { status: 500 });
  }
}
