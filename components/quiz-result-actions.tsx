'use client';

import { useEffect, useRef, useState } from 'react';
import { Bookmark, History, Share2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  isFavorite,
  saveHistory,
  toggleFavorite,
} from '@/lib/local-progress';

type QuizResultActionsProps = {
  testId: string;
  title: string;
  score: string;
  detail?: string;
  href: string;
};

export function QuizResultActions({
  testId,
  title,
  score,
  detail,
  href,
}: QuizResultActionsProps) {
  const [favorite, setFavorite] = useState(false);
  const [message, setMessage] = useState('');
  const savedKey = useRef('');
  const recordKey = `${testId}:${score}`;

  useEffect(() => {
    setFavorite(isFavorite(testId));
    if (savedKey.current === recordKey) return;
    savedKey.current = recordKey;
    saveHistory({
      id: `${testId}-${Date.now()}`,
      testId,
      title,
      score,
      detail,
      href,
      createdAt: new Date().toISOString(),
    });
  }, [detail, href, recordKey, score, testId, title]);

  async function shareResult() {
    const url = new URL('/share', window.location.origin);
    url.searchParams.set('test', title);
    url.searchParams.set('score', score);
    url.searchParams.set('detail', detail ?? '');
    url.searchParams.set('from', href);
    const text = `我在「${title}」的成绩是 ${score}，你要不要也来试试？`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title} · 成绩`, text, url: url.toString() });
        setMessage('已打开分享面板');
      } else {
        await navigator.clipboard.writeText(`${text}\n${url.toString()}`);
        setMessage('成绩链接已复制');
      }
    } catch {
      setMessage('分享已取消');
    }
  }

  function switchFavorite() {
    const next = toggleFavorite({ testId, title, href });
    setFavorite(next);
    setMessage(next ? '已加入收藏' : '已取消收藏');
  }

  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white/55 p-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={shareResult}
          className="h-10 rounded-xl border-black/10 bg-white/75 px-3 text-xs font-black"
        >
          <Share2 className="size-3.5" /> 分享成绩
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={switchFavorite}
          className="h-10 rounded-xl border-black/10 bg-white/75 px-3 text-xs font-black"
        >
          <Bookmark className={`size-3.5 ${favorite ? 'fill-current' : ''}`} />
          {favorite ? '已收藏' : '收藏测试'}
        </Button>
        <Link
          href="/history"
          className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-black/10 bg-white/75 px-3 text-xs font-black"
        >
          <History className="size-3.5" /> 我的记录
        </Link>
      </div>
      <p aria-live="polite" className="mt-2 text-center text-[11px] font-bold text-[#778078]">
        {message || '成绩会保存在这台设备上，不用登录。'}
      </p>
    </div>
  );
}
