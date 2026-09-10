'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ExternalLink, RotateCcw, Sparkles, X, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Community } from '@/components/community';

type Pokemon = {
  name: string;
  number: string;
  image: string;
  source: string;
  level: '热门' | '偏门';
};

const pokemon: Pokemon[] = [
  { name: '皮卡丘', number: '025', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png', source: 'https://www.pokemon.com/us/pokedex/pikachu', level: '热门' },
  { name: '芭瓢虫', number: '165', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/165.png', source: 'https://www.pokemon.com/us/pokedex/ledyba', level: '偏门' },
  { name: '喷火龙', number: '006', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png', source: 'https://www.pokemon.com/us/pokedex/charizard', level: '热门' },
  { name: '壶壶', number: '213', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/213.png', source: 'https://www.pokemon.com/us/pokedex/shuckle', level: '偏门' },
  { name: '伊布', number: '133', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/133.png', source: 'https://www.pokemon.com/us/pokedex/eevee', level: '热门' },
  { name: '大王燕', number: '277', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/277.png', source: 'https://www.pokemon.com/us/pokedex/swellow', level: '偏门' },
  { name: '杰尼龟', number: '007', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png', source: 'https://www.pokemon.com/us/pokedex/squirtle', level: '热门' },
  { name: '电萤虫', number: '313', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/313.png', source: 'https://www.pokemon.com/us/pokedex/illumise', level: '偏门' },
  { name: '小火龙', number: '004', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png', source: 'https://www.pokemon.com/us/pokedex/charmander', level: '热门' },
  { name: '熔岩蜗牛', number: '219', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/219.png', source: 'https://www.pokemon.com/us/pokedex/magcargo', level: '偏门' },
  { name: '妙蛙种子', number: '001', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png', source: 'https://www.pokemon.com/us/pokedex/bulbasaur', level: '热门' },
  { name: '派拉斯特', number: '047', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/047.png', source: 'https://www.pokemon.com/us/pokedex/parasect', level: '偏门' },
  { name: '耿鬼', number: '094', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/094.png', source: 'https://www.pokemon.com/us/pokedex/gengar', level: '热门' },
  { name: '铜镜怪', number: '436', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/436.png', source: 'https://www.pokemon.com/us/pokedex/bronzor', level: '偏门' },
  { name: '卡比兽', number: '143', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/143.png', source: 'https://www.pokemon.com/us/pokedex/snorlax', level: '热门' },
  { name: '蛋蛋', number: '102', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/102.png', source: 'https://www.pokemon.com/us/pokedex/exeggcute', level: '偏门' },
  { name: '超梦', number: '150', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/150.png', source: 'https://www.pokemon.com/us/pokedex/mewtwo', level: '热门' },
  { name: '夜巡灵', number: '355', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/355.png', source: 'https://www.pokemon.com/us/pokedex/duskull', level: '偏门' },
  { name: '路卡利欧', number: '448', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/448.png', source: 'https://www.pokemon.com/us/pokedex/lucario', level: '热门' },
  { name: '钥圈', number: '707', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/707.png', source: 'https://www.pokemon.com/us/pokedex/klefki', level: '偏门' },
  { name: '妙蛙花', number: '003', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/003.png', source: 'https://www.pokemon.com/us/pokedex/venusaur', level: '热门' },
  { name: '水箭龟', number: '009', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/009.png', source: 'https://www.pokemon.com/us/pokedex/blastoise', level: '热门' },
  { name: '巴大蝶', number: '012', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/012.png', source: 'https://www.pokemon.com/us/pokedex/butterfree', level: '偏门' },
  { name: '大比鸟', number: '018', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/018.png', source: 'https://www.pokemon.com/us/pokedex/pidgeot', level: '偏门' },
  { name: '雷丘', number: '026', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/026.png', source: 'https://www.pokemon.com/us/pokedex/raichu', level: '热门' },
  { name: '胖丁', number: '039', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png', source: 'https://www.pokemon.com/us/pokedex/jigglypuff', level: '热门' },
  { name: '喵喵', number: '052', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png', source: 'https://www.pokemon.com/us/pokedex/meowth', level: '热门' },
  { name: '怪力', number: '068', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/068.png', source: 'https://www.pokemon.com/us/pokedex/machamp', level: '偏门' },
  { name: '拉普拉斯', number: '131', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/131.png', source: 'https://www.pokemon.com/us/pokedex/lapras', level: '热门' },
  { name: '快龙', number: '149', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/149.png', source: 'https://www.pokemon.com/us/pokedex/dragonite', level: '热门' },
  { name: '梦幻', number: '151', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/151.png', source: 'https://www.pokemon.com/us/pokedex/mew', level: '热门' },
  { name: '月亮伊布', number: '197', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/197.png', source: 'https://www.pokemon.com/us/pokedex/umbreon', level: '热门' },
  { name: '巨钳螳螂', number: '212', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/212.png', source: 'https://www.pokemon.com/us/pokedex/scizor', level: '偏门' },
  { name: '班基拉斯', number: '248', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/248.png', source: 'https://www.pokemon.com/us/pokedex/tyranitar', level: '热门' },
  { name: '沙漠蜻蜓', number: '330', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/330.png', source: 'https://www.pokemon.com/us/pokedex/flygon', level: '偏门' },
  { name: '七夕青鸟', number: '334', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/334.png', source: 'https://www.pokemon.com/us/pokedex/altaria', level: '偏门' },
  { name: '巨金怪', number: '376', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/376.png', source: 'https://www.pokemon.com/us/pokedex/metagross', level: '热门' },
  { name: '烈咬陆鲨', number: '445', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/445.png', source: 'https://www.pokemon.com/us/pokedex/garchomp', level: '热门' },
  { name: '暴雪王', number: '460', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/460.png', source: 'https://www.pokemon.com/us/pokedex/abomasnow', level: '偏门' },
  { name: '波克基斯', number: '468', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/468.png', source: 'https://www.pokemon.com/us/pokedex/togekiss', level: '偏门' },
  { name: '帝牙卢卡', number: '483', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/483.png', source: 'https://www.pokemon.com/us/pokedex/dialga', level: '热门' },
  { name: '帕路奇亚', number: '484', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/484.png', source: 'https://www.pokemon.com/us/pokedex/palkia', level: '偏门' },
  { name: '骑拉帝纳', number: '487', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/487.png', source: 'https://www.pokemon.com/us/pokedex/giratina', level: '热门' },
  { name: '索罗亚', number: '570', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/570.png', source: 'https://www.pokemon.com/us/pokedex/zorua', level: '偏门' },
  { name: '水晶灯火灵', number: '609', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/609.png', source: 'https://www.pokemon.com/us/pokedex/chandelure', level: '偏门' },
  { name: '甲贺忍蛙', number: '658', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/658.png', source: 'https://www.pokemon.com/us/pokedex/greninja', level: '热门' },
  { name: '仙子伊布', number: '700', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/700.png', source: 'https://www.pokemon.com/us/pokedex/sylveon', level: '热门' },
  { name: '谜拟Q', number: '778', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/778.png', source: 'https://www.pokemon.com/us/pokedex/mimikyu', level: '偏门' },
  { name: '美录梅塔', number: '809', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/809.png', source: 'https://www.pokemon.com/us/pokedex/melmetal', level: '偏门' },
  { name: '苍响', number: '888', image: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/888.png', source: 'https://www.pokemon.com/us/pokedex/zacian', level: '热门' },
];

const rankCopy = [
  { min: 0.9, label: '图鉴全开·传说训练家', text: '这份冷热名单已经难不倒你了。' },
  { min: 0.75, label: '野外记录员', text: '热门不丢分，偏门也能稳稳认出。' },
  { min: 0.5, label: '优秀训练家', text: '你的轮廓感，已经相当不错了。' },
  { min: 0, label: '刚开始旅行', text: '别灰心，下一轮会认出更多。' },
];

export default function Home() {
  const [mode, setMode] = useState<10 | 20>(10);
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState<Pokemon[]>(() => pokemon.slice(0, 10));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const current = round[index] ?? pokemon[0];
  const options = useMemo(() => {
    const sameLevel = pokemon.filter((item) => item.level === current.level && item.name !== current.name);
    const otherLevel = pokemon.filter((item) => item.level !== current.level && item.name !== current.name);
    const otherNames = [...sameLevel, ...otherLevel].map((item) => item.name);
    const choices = [current.name, ...[0, 1, 2].map((offset) => otherNames[(index * 2 + offset) % otherNames.length])];
    const rotateBy = (index + 1) % choices.length;
    return [...choices.slice(rotateBy), ...choices.slice(0, rotateBy)];
  }, [current.level, current.name, index]);
  const rank = rankCopy.find((item) => score / round.length >= item.min) ?? rankCopy[rankCopy.length - 1];

  useEffect(() => {
    if (!started) return;
    setImageLoading(true);
    let checks = 0;
    const readyTimer = window.setInterval(() => {
      const image = imageRef.current;
      if (image?.complete && image.naturalWidth > 0) {
        setImageLoading(false);
        window.clearInterval(readyTimer);
      } else if (checks++ > 50) {
        setImageLoading(false);
        window.clearInterval(readyTimer);
      }
    }, 100);
    const nextPokemon = round[index + 1];
    if (nextPokemon) {
      const preloader = new window.Image();
      preloader.src = nextPokemon.image;
    }
    return () => window.clearInterval(readyTimer);
  }, [index, round, started]);

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: unknown) => unknown } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'read_current_silhouette_question',
      title: '读取当前宝可梦剪影题',
      description: '读取当前题号、可选名字和是否已经作答。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ question: index + 1, total: round.length, options, answered: answer !== null }),
    }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({
      name: 'answer_current_silhouette_question',
      title: '回答当前宝可梦剪影题',
      description: '从当前选项中选择一个宝可梦名字并显示答题反馈。',
      inputSchema: { type: 'object', properties: { name: { type: 'string', enum: options } }, required: ['name'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input: unknown) => {
        const name = typeof (input as { name?: unknown })?.name === 'string' ? (input as { name: string }).name : '';
        if (answer !== null) throw new Error('当前题已经作答。');
        if (!options.includes(name)) throw new Error('答案不在当前选项中。');
        const correct = name === current.name;
        setAnswer(name);
        if (correct) setScore((value) => value + 1);
        return { name, correct, answer: current.name };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [answer, current.name, index, options, round.length]);

  function choose(name: string) {
    if (answer || showResult) return;
    setAnswer(name);
    if (name === current.name) setScore((value) => value + 1);
  }

  function next() {
    if (index === round.length - 1) {
      setShowResult(true);
      return;
    }
    setIndex((value) => value + 1);
    setAnswer(null);
  }

  function restart() {
    setStarted(false);
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setShowResult(false);
  }

  const progress = showResult ? 100 : ((index + (answer ? 1 : 0)) / round.length) * 100;

  function startGame() {
    setRound([...pokemon].sort(() => Math.random() - 0.5).slice(0, mode));
    setStarted(true);
    setIndex(0);
    setAnswer(null);
    setScore(0);
    setShowResult(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#071632] px-5 py-7 text-white sm:px-8">
      <div aria-hidden="true" className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,#1d3967_0%,transparent_42%),radial-gradient(circle_at_0%_100%,#10264c_0%,transparent_40%)]" />
      <div className="relative mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#d54545] text-[#ffe185]"><Zap className="size-5" /></span>
            <span><b className="block text-lg">宝可梦剪影局</b><small className="text-[10px] tracking-[.16em] text-[#a7b8db]">SILHOUETTE QUIZ</small></span>
          </a>
          {started && <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{showResult ? round.length : index + 1} / {round.length}</span>}
        </header>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="答题进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="h-full rounded-full bg-[#ffe185] transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        <section className="py-10 text-center sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#193563] px-3 py-1.5 text-xs font-black text-[#ffe185]"><Sparkles className="size-3.5" />官方图鉴素材 · 热门 × 偏门</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">热门冷门，认得出几个？</h1>
          <p className="mt-3 text-sm font-semibold text-[#b8c6df]">50 只宝可梦交叉出题，认错也算涨知识。</p>
          {!started && <><div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">{([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#ffe185] bg-[#253f68]' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}><p className="font-black text-white">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#b8c6df]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}</div><Button type="button" onClick={startGame} className="mx-auto mt-7 h-12 rounded-2xl bg-[#d54545] px-6 font-black text-white hover:bg-[#bd3535]">开始挑战 <ArrowRight className="size-4" /></Button></>}
        </section>

        {started && !showResult ? (
          <>
            <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#10264c] p-3 shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-5">
              <div key={current.number} className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,#193563_0%,#0d1d3c_55%,#071632_100%)] p-5">
                <div aria-hidden="true" className="absolute -left-12 -top-12 size-44 rounded-full border border-[#ffe185]/15" />
                <div aria-hidden="true" className="absolute -bottom-16 -right-10 size-48 rounded-full border-[18px] border-[#d54545]/15" />
                <img
                  ref={imageRef}
                  src={current.image}
                  alt={current.name}
                  loading="eager"
                  decoding="async"
                  className={`relative z-10 h-[88%] max-w-[78%] object-contain drop-shadow-[0_18px_20px_rgba(0,0,0,.5)] transition duration-300 ${answer ? '' : 'brightness-0 saturate-0 contrast-200'}`}
                  onLoad={() => setImageLoading(false)}
                  onError={(event) => {
                    setImageLoading(false);
                    event.currentTarget.style.display = 'none';
                    const fallback = event.currentTarget.nextElementSibling;
                    if (fallback instanceof HTMLElement) fallback.style.display = 'grid';
                  }}
                />
                {imageLoading && <div className="absolute inset-0 z-20 grid place-items-center bg-[#0b1b38]/80 p-8 text-center"><div><span className="mx-auto grid size-10 place-items-center rounded-2xl border-2 border-[#ffe185]/30 border-t-[#ffe185] animate-spin" /><p className="mt-3 text-sm font-bold text-[#c4d2e8]">正在加载官方图鉴…</p></div></div>}
                <div className="absolute inset-0 z-20 hidden place-items-center bg-[#0b1b38] p-8 text-center" aria-live="polite"><div><p className="text-3xl font-black text-[#ffe185]">{current.name}</p><p className="mt-2 text-sm text-[#b8c6df]">官方图像暂时加载失败，请稍后重试</p></div></div>
                {!answer && !imageLoading && <span className="absolute bottom-4 z-10 rounded-full bg-[#071632]/80 px-3 py-1 text-[10px] font-black tracking-[.14em] text-[#ffe185]">WHO&apos;S THAT?</span>}
              </div>
            </section>

            <section className="mt-6" aria-label="选择答案">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-[#a7b8db]"><span>第 {index + 1} 题</span><span>{current.level}题 · 看图选名字</span></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {options.map((name, optionIndex) => {
                  const correct = answer !== null && name === current.name;
                  const wrong = answer === name && name !== current.name;
                  return <Button key={name} type="button" onClick={() => choose(name)} disabled={answer !== null} variant="outline" className={`h-[62px] justify-start rounded-2xl border-white/15 bg-white/5 px-5 text-left font-black text-white transition-all hover:bg-white/10 disabled:cursor-default disabled:opacity-100 ${correct ? 'border-[#61d5ad] bg-[#17423d] text-[#d9fff1]' : ''} ${wrong ? 'border-[#f28a78] bg-[#512d3b] text-[#ffe5de]' : ''}`}><span className={`mr-3 grid size-7 place-items-center rounded-lg text-xs ${correct ? 'bg-[#61d5ad] text-[#0b2a27]' : wrong ? 'bg-[#f28a78] text-[#381925]' : 'bg-white/10 text-[#ffe185]'}`}>{correct ? <Check className="size-4" /> : wrong ? <X className="size-4" /> : String.fromCharCode(65 + optionIndex)}</span>{name}</Button>;
                })}
              </div>
            </section>

            {answer && (
              <div className={`mt-5 rounded-3xl border p-5 ${answer === current.name ? 'border-[#61d5ad]/30 bg-[#17423d]' : 'border-[#f28a78]/30 bg-[#3d2947]'}`} aria-live="polite">
                <div className="flex items-start gap-3"><span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl ${answer === current.name ? 'bg-[#61d5ad] text-[#0b2a27]' : 'bg-[#f28a78] text-[#381925]'}`}>{answer === current.name ? <Check className="size-4" /> : <X className="size-4" />}</span><div><p className="font-black">{answer === current.name ? '答对了！' : '差一点，这题是：' + current.name}</p><p className="mt-2 text-sm text-[#c4d2e8]">图鉴编号 #{current.number} · 答案来自宝可梦官方图鉴。</p><a href={current.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#ffe185] underline decoration-white/20 underline-offset-4">查看官方图鉴 <ExternalLink className="size-3" /></a></div></div>
                  <Button type="button" onClick={next} className="mt-5 h-11 rounded-2xl bg-[#d54545] px-5 font-black text-white shadow-[0_6px_20px_rgba(213,69,69,.25)] hover:bg-[#bd3535]">{index === round.length - 1 ? '查看成绩' : '下一题'} <ArrowRight className="size-4" /></Button>
              </div>
            )}
          </>
        ) : started && showResult ? (
          <section className="rounded-[2rem] border border-white/10 bg-[#163765] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,.25)] sm:p-9"><p className="text-sm font-black tracking-[.14em] text-[#ffe185]">冷热剪影完成</p><p className="mt-3 text-6xl font-black">{score}<span className="text-2xl text-[#b8c6df]"> / {round.length}</span></p><h2 className="mt-6 text-2xl font-black">{rank.label}</h2><p className="mt-2 text-sm text-[#b8c6df]">{rank.text}</p><Button type="button" onClick={restart} className="mt-7 h-11 rounded-2xl bg-[#d54545] px-5 font-black text-white hover:bg-[#bd3535]"><RotateCcw className="size-4" />再猜一轮</Button></section>
        ) : null}
        <Community quizName="宝可梦剪影局" tone="sky" />
      </div>
    </main>
  );
}
