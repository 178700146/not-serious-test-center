'use client';

import { Suspense } from 'react';
import { ArrowRight, Check, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ShareCard() {
  const params = useSearchParams();
  const title = params.get('test') || '不太正经测试中心';
  const score = params.get('score') || '刚刚完成';
  const detail = params.get('detail');
  const requestedFrom = params.get('from') || '/';
  const from = requestedFrom.startsWith('/') && !requestedFrom.startsWith('//') ? requestedFrom : '/';

  return (
    <main className="min-h-screen bg-[#f7f2e7] px-5 py-10 text-[#1d2431] sm:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-[#2b334d]/12 bg-[#fffdf8] p-6 text-center shadow-[0_20px_50px_rgba(43,51,77,.12)] sm:p-10">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#252b49] text-[#f4ce67] shadow-[4px_4px_0_#d85f48]">
            <Share2 className="size-7" />
          </div>
          <p className="mt-6 text-xs font-black tracking-[.16em] text-[#d85f48]">成绩分享卡</p>
          <h1 className="mt-3 font-serif text-3xl font-black tracking-tight text-[#252b49]">{title}</h1>
          <div className="mt-7 rounded-3xl bg-[#252b49] px-5 py-7 text-[#fff8e8]">
            <p className="text-xs font-bold text-[#cbd1df]">我的成绩</p>
            <p className="mt-2 break-words text-5xl font-black tracking-tight text-[#f4ce67]">{score}</p>
            {detail && <p className="mt-3 text-sm font-bold text-[#cbd1df]">{detail}</p>}
          </div>
          <p className="mt-6 text-sm font-semibold leading-6 text-[#737986]">也来测一下，看看你能不能超过我。</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={from} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#d85f48] px-5 text-sm font-black text-white shadow-[3px_3px_0_#f0ad50] transition hover:bg-[#c5513d]">
              去挑战 <ArrowRight className="size-4" />
            </Link>
            <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-[#d5d4ce] bg-white px-5 text-sm font-black text-[#4e5669] transition hover:bg-[#f3eee2]">
              <Check className="size-4" /> 测试中心
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function SharePage() {
  return <Suspense fallback={<main className="min-h-screen bg-[#f7f2e7]" />}><ShareCard /></Suspense>;
}
