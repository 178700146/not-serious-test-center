'use client';

import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bird,
  ChevronRight,
  CircleHelp,
  FlaskConical,
  Leaf,
  Search,
  Sparkles,
  Telescope,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type TestCard = {
  category: '自然界' | '观察力' | '冷知识' | '奇怪技能';
  eyebrow: string;
  title: string;
  description: string;
  state: 'available' | 'soon';
  href?: string;
  image?: string;
  icon: typeof Leaf;
  color: string;
};

const tests: TestCard[] = [
  {
    category: '自然界',
    eyebrow: 'NO. 001 · 20 题',
    title: '蘑菇大师',
    description: '只看一眼，猜猜这朵蘑菇有毒吗？',
    state: 'available',
    href: 'https://mushroom-master-quiz-01a05b.kind-song-3636.chatgpt.site/',
    image: 'https://mushroom-master-quiz-01a05b.kind-song-3636.chatgpt.site/og.png',
    icon: Leaf,
    color: 'mushroom-card',
  },
  {
    category: '观察力',
    eyebrow: 'NEXT UP',
    title: '树影辨认师',
    description: '从叶片、树皮和影子里，找出树林的线索。',
    state: 'soon',
    icon: Telescope,
    color: 'tree-card',
  },
  {
    category: '冷知识',
    eyebrow: 'NEXT UP',
    title: '鸟鸣记忆库',
    description: '有些声音你听过，但能认出来吗？',
    state: 'soon',
    icon: Bird,
    color: 'bird-card',
  },
  {
    category: '奇怪技能',
    eyebrow: 'NEXT UP',
    title: '气味形容家',
    description: '把一阵风、一本旧书和雨后的柏油路说清楚。',
    state: 'soon',
    icon: FlaskConical,
    color: 'scent-card',
  },
];

const categories = ['全部', '自然界', '观察力', '冷知识', '奇怪技能'] as const;
type Category = (typeof categories)[number];

export default function Home() {
  const [category, setCategory] = useState<Category>('全部');
  const [query, setQuery] = useState('');

  const visibleTests = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return tests.filter((test) => {
      const matchesCategory = category === '全部' || test.category === category;
      const matchesQuery = !keyword || `${test.title}${test.description}${test.category}`.toLowerCase().includes(keyword);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f2e7] text-[#1d2431]">
      <div aria-hidden="true" className="paper-grain fixed inset-0 pointer-events-none" />
      <div aria-hidden="true" className="absolute left-[-180px] top-[-150px] size-[460px] rounded-full bg-[#f4ce67]/35 blur-3xl" />
      <div aria-hidden="true" className="absolute right-[-160px] top-[330px] size-[420px] rounded-full bg-[#b5c8ff]/30 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-10 pt-5 sm:px-8 sm:pt-7 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <a href="#top" className="group inline-flex items-center gap-3" aria-label="返回首页">
            <span className="grid size-10 rotate-[-8deg] place-items-center rounded-[14px] bg-[#242a42] text-[#f9d96f] shadow-[4px_4px_0_#f0ad50] transition-transform group-hover:rotate-0"><CircleHelp className="size-5" strokeWidth={2.6} /></span>
            <span className="leading-none"><span className="block text-lg font-black tracking-tight sm:text-xl">不太正经测试中心</span><span className="mt-1 block text-[10px] font-bold tracking-[0.16em] text-[#767b87]">NOT-SO-SERIOUS LAB</span></span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-bold text-[#565d6b] md:flex"><a href="#tests" className="hover:text-[#252b49]">全部测试</a><a href="#about" className="hover:text-[#252b49]">关于这里</a></div>
          <span className="rounded-full border border-[#2e3552]/15 bg-[#fffaf0]/80 px-3.5 py-2 text-xs font-bold text-[#535b6c] shadow-sm">已收录 01 项</span>
        </header>

        <section id="top" className="grid items-end gap-9 pb-10 pt-16 lg:grid-cols-[1.08fr_.92fr] lg:pb-16 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex -rotate-2 items-center gap-2 rounded-full border border-[#d9b75f] bg-[#fff0bd] px-3.5 py-2 text-xs font-black tracking-[0.09em] text-[#745123] shadow-[3px_3px_0_#e2b756]"><Sparkles className="size-3.5" /> 今日宜：好奇一点</div>
            <h1 className="max-w-3xl font-serif text-[clamp(3rem,7.2vw,6.7rem)] font-black leading-[.94] tracking-[-0.08em] text-[#242a42]">不太正经<br /><span className="relative inline-block text-[#d85f48]">测试中心<span aria-hidden="true" className="absolute -bottom-1 left-1 h-2 w-[92%] -rotate-1 rounded-full bg-[#f5cf6a]/80" /></span></h1>
            <p className="mt-7 max-w-xl text-lg font-semibold leading-8 text-[#5f6472] sm:text-xl">这里专门测试那些奇奇怪怪的本事。</p>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#7a7f8c]">有些题没什么用，但答对的那一刻，心情会很好。</p>
            <div className="mt-9 flex flex-wrap gap-3"><a href="#tests"><Button size="lg" className="h-12 rounded-2xl bg-[#252b49] px-5 font-bold text-[#fff9ea] shadow-[4px_4px_0_#f0ad50] hover:bg-[#373f64]">开始乱逛 <ChevronRight className="size-4" /></Button></a><a href="https://mushroom-master-quiz-01a05b.kind-song-3636.chatgpt.site/"><Button variant="outline" size="lg" className="h-12 rounded-2xl border-[#cdd1d5] bg-[#fffdf8]/75 px-5 font-bold text-[#3f4657] hover:bg-white">先测蘑菇 <ArrowUpRight className="size-4" /></Button></a></div>
          </div>

          <aside className="relative mx-auto w-full max-w-md rotate-[2deg] rounded-[2rem] border border-[#2b334d]/12 bg-[#fffdf7] p-4 shadow-[10px_12px_0_rgba(44,49,75,.13)]">
            <div className="rounded-[1.45rem] bg-[#252b49] p-5 text-[#f9f0d9]">
              <div className="flex items-center justify-between"><span className="rounded-full bg-[#f4ce67] px-3 py-1 text-[11px] font-black tracking-[0.1em] text-[#4a3b21]">中心档案</span><span className="text-xs font-bold text-[#aeb5c9]">ISSUE 01</span></div>
              <p className="mt-12 font-serif text-3xl font-black leading-none">把好奇心<br />当作一项技能。</p>
              <div className="mt-10 grid grid-cols-2 border-t border-white/15 pt-4 text-xs"><div><p className="font-bold text-[#aeb5c9]">当前收录</p><p className="mt-1 text-xl font-black text-[#f4ce67]">01</p></div><div className="border-l border-white/15 pl-4"><p className="font-bold text-[#aeb5c9]">正在筹备</p><p className="mt-1 text-xl font-black text-[#f4ce67]">03</p></div></div>
            </div>
            <div className="absolute -bottom-5 -left-5 grid size-16 -rotate-12 place-items-center rounded-full border-[5px] border-[#fffdf7] bg-[#d85f48] text-center text-[10px] font-black leading-3 text-white shadow-md">冷门<br />专用</div>
          </aside>
        </section>

        <section id="tests" className="scroll-mt-6 border-t border-[#2b334d]/12 pt-8 sm:pt-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black tracking-[0.16em] text-[#d85f48]">THE SHELF</p><h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.05em] text-[#252b49] sm:text-4xl">测试陈列架</h2></div><label className="relative block w-full sm:w-72"><Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#858a95]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜一个奇怪技能" className="h-11 rounded-2xl border-[#d7d7d2] bg-[#fffdf8]/85 pl-10 text-sm shadow-sm placeholder:text-[#a1a4ab]" /></label></div>
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${category === item ? 'bg-[#252b49] text-[#fff9ea] shadow-[3px_3px_0_#f0ad50]' : 'border border-[#d5d4ce] bg-[#fffdf8]/70 text-[#626978] hover:border-[#a9adba]'}`}>{item}</button>)}</div>

          {visibleTests.length > 0 ? <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{visibleTests.map((test) => {
            const Icon = test.icon;
            const body = <><div className={`relative h-48 overflow-hidden rounded-[1.35rem] ${test.color}`}>{test.image ? <img src={test.image} alt="雨林里的蘑菇" className="size-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 grid place-items-center"><Icon className="size-14 text-[#273049]/75" strokeWidth={1.45} /></div>}<span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-black tracking-[0.08em] ${test.state === 'available' ? 'bg-[#f5cf6a] text-[#4d4025]' : 'bg-[#fffdf8]/85 text-[#6e7381]'}`}>{test.state === 'available' ? '现在可测' : '筹备中'}</span></div><div className="px-1 pb-1 pt-5"><p className="text-[10px] font-black tracking-[0.13em] text-[#d85f48]">{test.eyebrow}</p><h3 className="mt-2 text-xl font-black tracking-tight text-[#272d48]">{test.title}</h3><p className="mt-2 min-h-11 text-sm leading-5 text-[#737986]">{test.description}</p><div className="mt-5 flex items-center justify-between text-xs font-bold"><span className="rounded-full bg-[#f3eee2] px-2.5 py-1.5 text-[#666c78]">{test.category}</span>{test.state === 'available' && <span className="inline-flex items-center gap-1 text-[#303855]">去试试 <ArrowUpRight className="size-3.5" /></span>}</div></div></>;
            return test.href ? <a key={test.title} href={test.href} className="group block rounded-[1.65rem] border border-[#2b334d]/12 bg-[#fffdf8]/85 p-3 shadow-[0_10px_25px_rgba(43,51,77,.05)] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(43,51,77,.13)]">{body}</a> : <article key={test.title} className="rounded-[1.65rem] border border-dashed border-[#c9cbd0] bg-[#fffdf8]/52 p-3">{body}</article>;
          })}</div> : <div className="mt-7 rounded-[1.65rem] border border-dashed border-[#c5c8cf] bg-[#fffdf8]/65 px-6 py-12 text-center"><CircleHelp className="mx-auto size-8 text-[#d85f48]" /><p className="mt-4 font-black text-[#303752]">这项奇怪技能还没被收录。</p><button type="button" onClick={() => { setQuery(''); setCategory('全部'); }} className="mt-3 text-sm font-bold text-[#d85f48] hover:underline">回到全部测试</button></div>}
        </section>

        <section id="about" className="mt-14 grid gap-6 rounded-[2rem] bg-[#e9e1cf]/80 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-9"><div><p className="text-xs font-black tracking-[0.16em] text-[#a65843]">ABOUT THIS PLACE</p><h2 className="mt-2 font-serif text-2xl font-black tracking-[-0.04em] text-[#343952] sm:text-3xl">认真出题，测试不太正经。</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#6a6b70]">我们把那些平时不会有人考你的知识和观察力，做成可以随手玩的题。</p></div><span className="inline-flex h-11 items-center justify-center rounded-2xl bg-[#fff9eb] px-4 text-sm font-black text-[#5e6271] shadow-sm">下一项正在发芽 <Leaf className="ml-2 size-4 text-[#6f9b64]" /></span></section>

        <footer className="flex flex-col gap-2 py-9 text-xs font-semibold text-[#888a8f] sm:flex-row sm:items-center sm:justify-between"><p>不太正经测试中心 · 为好奇心保留一张座位</p><p>第 01 期 · 蘑菇大师已上线</p></footer>
      </div>
    </main>
  );
}
