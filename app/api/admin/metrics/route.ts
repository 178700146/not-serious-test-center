import { readSiteMetrics } from '@/db/metrics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const expectedPin = (process.env.ADMIN_PIN ?? '').trim();
  const providedPin = request.headers.get('x-admin-pin')?.trim() ?? '';
  if (!expectedPin || providedPin !== expectedPin) {
    return Response.json({ error: '管理口令不正确。' }, { status: 401 });
  }
  try {
    return Response.json({ metrics: await readSiteMetrics() }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[admin:metrics]', error);
    return Response.json({ error: '统计暂时不可用，请检查 Supabase 配置。' }, { status: 503 });
  }
}
