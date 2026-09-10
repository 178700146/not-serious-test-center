'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Headphones, RotateCcw, Sparkles, Volume2, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Community } from '@/components/community';

type SoundClue = {
  name: string;
  videoId: string;
  start: number;
  end: number;
};

const seedClues: SoundClue[] = [
  { name: '泰罗奥特曼', videoId: 'fQYCxtKURoI', start: 3, end: 15 },
  { name: '赛文奥特曼', videoId: 'Psxw8gP8FJI', start: 4, end: 16 },
  { name: '杰克奥特曼', videoId: 'JxaEJyCvFUQ', start: 6, end: 18 },
  { name: '盖亚奥特曼', videoId: 'M96y7IeL_GE', start: 4, end: 16 },
  { name: '泰迦奥特曼', videoId: 'CpKyk4DfI6A', start: 5, end: 17 },
  { name: '迪迦奥特曼', videoId: 'kPRtmeSQSHo', start: 5, end: 17 },
  { name: '赛罗奥特曼', videoId: '0cVGZys4EFQ', start: 4, end: 16 },
  { name: '梦比优斯奥特曼', videoId: 'RpcEGx00r4w', start: 6, end: 18 },
  { name: '奥特曼X', videoId: 'CfAqiA_5d_U', start: 5, end: 17 },
  { name: '捷德奥特曼', videoId: 'flFoxXmSFmw', start: 5, end: 17 },
];

// 10 段官方音轨切成不同时间窗，组成 50 题练习池；每轮仍会随机抽题。
const clues: SoundClue[] = Array.from({ length: 5 }, (_, cycle) => seedClues.map((clue) => ({
  ...clue,
  start: clue.start + cycle * 4,
  end: clue.end + cycle * 4,
}))).flat();

const heroNames = [...new Set(seedClues.map((item) => item.name))];

export default function Home() {
  const [phase, setPhase] = useState<'intro' | 'playing'>('intro');
  const [mode, setMode] = useState<10 | 20>(10);
  const [round, setRound] = useState<SoundClue[]>(() => clues.slice(0, 10));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [playNonce, setPlayNonce] = useState(0);
  const clue = round[index] ?? round[0];
  const options = useMemo(() => {
    const distractors = heroNames.filter((name) => name !== clue.name);
    const choices = [clue.name, ...[0, 1, 2].map((offset) => distractors[(index + offset) % distractors.length])];
    const offset = index % choices.length;
    return [...choices.slice(offset), ...choices.slice(0, offset)];
  }, [clue.name, index]);
  const finished = answer !== null && index === round.length - 1;

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: unknown) => unknown } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'read_current_sound_question',
      title: '读取当前听声题',
      description: '读取当前题号、可选奥特曼名字和是否已经作答。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ question: index + 1, total: round.length, options, answered: answer !== null }),
    }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({
      name: 'answer_current_sound_question',
      title: '回答当前听声题',
      description: '从当前可见选项中选择一个奥特曼名字并显示答题反馈。',
      inputSchema: { type: 'object', properties: { name: { type: 'string', enum: options } }, required: ['name'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: unknown) => {
        const name = typeof (input as { name?: unknown })?.name === 'string' ? (input as { name: string }).name : '';
        if (answer !== null) throw new Error('当前题已经作答。');
        if (!options.includes(name)) throw new Error('答案不在当前选项中。');
        const correct = name === clue.name;
        setAnswer(name);
        if (correct) setScore((value) => value + 1);
        return { name, correct, answer: clue.name };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [answer, clue.name, index, options, round.length]);

  function choose(name: string) {
    if (answer) return;
    setAnswer(name);
    if (name === clue.name) setScore((value) => value + 1);
  }

  function next() {
    if (index === round.length - 1) return;
    setIndex((value) => value + 1);
    setAnswer(null);
    setPlayNonce(0);
  }

  function restart() {
    setPhase('intro');
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setPlayNonce(0);
  }

  function startGame() {
    setRound([...clues].sort(() => Math.random() - 0.5).slice(0, mode));
    setPhase('playing');
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setPlayNonce(0);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#071632] px-5 py-7 text-white sm:px-8">
      <div aria-hidden="true" className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,#1d3967_0%,transparent_42%),radial-gradient(circle_at_0%_100%,#10264c_0%,transparent_40%)]" />
      <div className="relative mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#d54545] text-[#ffe185]"><Zap className="size-5" /></span>
            <span><b className="block text-lg">奥特曼听声局</b><small className="text-[10px] tracking-[.16em] text-[#a7b8db]">ULTRA SOUND QUIZ</small></span>
          </a>
          {phase === 'playing' && <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{index + 1} / {round.length}</span>}
        </header>

        {phase === 'intro' && <section className="py-10 text-center sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#193563] px-3 py-1.5 text-xs font-black text-[#ffe185]"><Sparkles className="size-3.5" />官方公开视频音轨</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">听叫声，选出名字</h1>
          <p className="mt-3 text-sm font-semibold text-[#b8c6df]">50 题库，先戴好耳机，再凭直觉选一个。</p>
          <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">{([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#ffe185] bg-[#253f68]' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}><p className="font-black text-white">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#b8c6df]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}</div>
          <Button type="button" onClick={startGame} className="mx-auto mt-7 h-12 rounded-2xl bg-[#d54545] px-6 font-black text-white hover:bg-[#bd3535]">开始挑战 <ArrowRight className="size-4" /></Button>
        </section>}

        {phase === 'playing' && <>
        {playNonce > 0 && <iframe key={playNonce} title="官方公开视频音轨" className="absolute -left-[9999px] top-0 h-px w-px border-0 opacity-0" src={`https://www.youtube-nocookie.com/embed/${clue.videoId}?autoplay=1&controls=0&playsinline=1&start=${clue.start}&end=${clue.end}&rel=0`} allow="autoplay" />}

        <div className="rounded-[2rem] border border-white/10 bg-[#10264c] p-4 shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-5">
          <div className="relative grid min-h-60 place-items-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,#193563_0%,#0d1d3c_55%,#071632_100%)] px-6 text-center">
            <div aria-hidden="true" className="absolute inset-x-0 bottom-7 flex items-end justify-center gap-1 opacity-70">{[18, 34, 22, 49, 28, 65, 35, 44, 21, 57, 30, 46, 25, 38, 19].map((height, itemIndex) => <span key={itemIndex} className="w-1 rounded-full bg-[#ffe185] shadow-[0_0_10px_#d54545]" style={{ height }} />)}</div>
            <div className="relative"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#d54545] text-[#ffe185] shadow-[0_0_28px_rgba(213,69,69,.34)]"><Headphones className="size-8" /></span><p className="mt-5 text-lg font-black">这一声，来自谁？</p><Button type="button" onClick={() => setPlayNonce((value) => value + 1)} className="mt-5 h-12 rounded-2xl bg-[#d54545] px-5 font-black text-white shadow-[0_6px_20px_rgba(213,69,69,.25)] hover:bg-[#bd3535]"><Volume2 className="size-5" />{playNonce ? '再听一次' : '播放声音'}</Button></div>
            <p className="relative mt-4 max-w-sm text-xs font-semibold leading-5 text-[#b8c6df]">若点击后仍没有声音，请检查浏览器是否拦截播放；当前音轨来自公开视频，部分网络环境可能无法访问。</p>
          </div>
        </div>

        {finished ? (
          <section className="mt-6 rounded-[2rem] border border-white/10 bg-[#163765] p-7 text-center sm:p-9"><p className="text-sm font-black tracking-[.14em] text-[#ffe185]">你的成绩</p><p className="mt-3 text-6xl font-black">{score}<span className="text-2xl text-[#b8c6df]"> / {round.length}</span></p><h2 className="mt-6 text-2xl font-black">{score === round.length ? '你的耳朵，已经是光之国认证。' : score / round.length >= 0.4 ? '这耳朵，确实听过不少光。' : '先别急，再听一轮。'}</h2><Button type="button" onClick={restart} className="mt-7 h-11 rounded-2xl bg-[#d54545] px-5 font-black text-white hover:bg-[#bd3535]"><RotateCcw className="size-4" />再听一次</Button></section>
        ) : (
          <section className="mt-6"><div className="grid gap-3 sm:grid-cols-2">{options.map((name, optionIndex) => <Button key={name} type="button" onClick={() => choose(name)} variant="outline" className={`h-[62px] justify-start rounded-2xl border-white/15 bg-white/5 px-5 text-left font-black text-white hover:bg-white/10 ${answer && name === clue.name ? 'border-[#61d5ad] bg-[#17423d]' : ''}`}><span className="mr-3 text-xs text-[#ffe185]">{String.fromCharCode(65 + optionIndex)}</span>{name}</Button>)}</div>{answer && <div className={`mt-5 rounded-3xl p-5 ${answer === clue.name ? 'bg-[#17423d]' : 'bg-[#3d2947]'}`}><p className="font-black">{answer === clue.name ? '答对了！' : `答案是：${clue.name}`}</p><p className="mt-2 text-sm text-[#b8c6df]">音源来自圆谷官方公开视频片段。</p><Button type="button" onClick={next} className="mt-4 h-10 rounded-2xl bg-[#d54545] font-black text-white hover:bg-[#bd3535]">下一题 <ArrowRight className="size-4" /></Button></div>}</section>
        )}
        </>}
        <Community quizName="奥特曼听声局" tone="sky" />
      </div>
    </main>
  );
}
