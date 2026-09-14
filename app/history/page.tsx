'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, History, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  clearHistory,
  readFavorites,
  readHistory,
  type FavoriteEntry,
  type HistoryEntry,
} from '@/lib/local-progress';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function numericScore(score: string) {
  const milliseconds = score.match(/^(\d+)\s*ms$/i);
  if (milliseconds) return { value: Number(milliseconds[1]), direction: 'low' as const };
  const points = score.match(/^(\d+)\s*\/\s*(\d+)/);
  if (points) return { value: Number(points[1]) / Number(points[2]), direction: 'high' as const };
  return null;
}

function compareWithPrevious(current: HistoryEntry, previous?: HistoryEntry) {
  if (!previous) return null;
  const now = numericScore(current.score);
  const before = numericScore(previous.score);
  if (!now || !before || now.direction !== before.direction) return null;
  if (now.value === before.value) return '和上次一样';
  const improved = now.direction === 'low' ? now.value < before.value : now.value > before.value;
  return improved ? '比上次更好' : '比上次低一点';
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    setHistory(readHistory());
    setFavorites(readFavorites());
  }, []);

  function removeHistory() {
    clearHistory();
    setHistory([]);
  }

  return (
    <main className="min-h-screen bg-[#f7f2e7] px-5 py-7 text-[#1d2431] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black text-[#555d70] hover:text-[#252b49]">
            <ArrowLeft className="size-4" /> 返回测试中心
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2e3552]/15 bg-[#fffaf0]/80 px-3 py-2 text-xs font-bold text-[#535b6c]">
            <History className="size-3.5 text-[#d85f48]" /> 我的记录
          </span>
        </header>

        <section className="mt-8 rounded-[2rem] bg-[#252b49] p-7 text-[#fff8e8] shadow-[0_18px_45px_rgba(37,43,73,.18)] sm:p-9">
          <p className="text-xs font-black tracking-[.16em] text-[#f4ce67]">LOCAL ARCHIVE</p>
          <h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">你的测试档案</h1>
          <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-[#cbd1df]">
            成绩只保存在这台设备上，不需要注册。换浏览器或清理浏览器数据后，记录也会一起消失。
          </p>
        </section>

        <section className="mt-7 rounded-[2rem] border border-[#2b334d]/12 bg-[#fffdf8]/90 p-6 shadow-[0_12px_28px_rgba(43,51,77,.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-black text-[#252b49]"><Bookmark className="size-5 text-[#d85f48]" /> 收藏的测试</h2>
          </div>
          {favorites.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#c9cbd0] px-4 py-5 text-sm font-semibold text-[#858a95]">还没有收藏，测完结果时可以顺手收藏。</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {favorites.map((item) => <Link key={item.testId} href={item.href} className="rounded-full bg-[#fff0bd] px-3.5 py-2 text-sm font-black text-[#6f5429] hover:bg-[#f4ce67]">{item.title}</Link>)}
            </div>
          )}
        </section>

        <section className="mt-5 rounded-[2rem] border border-[#2b334d]/12 bg-[#fffdf8]/90 p-6 shadow-[0_12px_28px_rgba(43,51,77,.06)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-black text-[#252b49]"><History className="size-5 text-[#d85f48]" /> 最近成绩</h2>
            {history.length > 0 && <Button type="button" variant="outline" onClick={removeHistory} className="h-9 rounded-xl border-[#d7d7d2] px-3 text-xs font-black text-[#777d88]"><Trash2 className="size-3.5" /> 清空记录</Button>}
          </div>
          {history.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-[#c9cbd0] px-4 py-5 text-sm font-semibold text-[#858a95]">完成一次测试后，成绩会出现在这里。</p>
          ) : (
            <ol className="mt-4 grid gap-2">
              {history.map((item, index) => {
                const previous = history.slice(index + 1).find((entry) => entry.testId === item.testId);
                const comparison = compareWithPrevious(item, previous);
                return <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f3eee2] px-4 py-3"><Link href={item.href} className="min-w-0 font-black text-[#303752] hover:underline">{item.title}</Link><span className="text-sm font-black text-[#d85f48]">{item.score}</span>{comparison && <span className={`rounded-full px-2 py-1 text-[10px] font-black ${comparison === '比上次更好' ? 'bg-[#d9f1e2] text-[#3d7759]' : 'bg-[#fff0bd] text-[#80602a]'}`}>{comparison}</span>}<time className="text-xs font-semibold text-[#858a95]">{formatDate(item.createdAt)}</time></li>;
              })}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
