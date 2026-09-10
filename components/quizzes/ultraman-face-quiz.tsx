'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, ExternalLink, RotateCcw, Sparkles, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Community } from '@/components/community';

type Hero = {
  name: string;
  image: string;
  source: string;
  level: '热门' | '偏门';
};

// 热门与偏门交叉出题，图像来自圆谷官方角色页。
const heroes: Hero[] = [
  {
    name: '初代奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/ULM_Hero_c01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman',
    level: '热门',
  },
  {
    name: '乔尼亚斯奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/UltramanJoneus_01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-joneus',
    level: '偏门',
  },
  {
    name: '赛文奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/SEVEN_Hero01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraseven',
    level: '热门',
  },
  {
    name: '葛雷奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/UltramanGreat_01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-great',
    level: '偏门',
  },
  {
    name: '杰克奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/06/RU_Hero_jack01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-jack',
    level: '热门',
  },
  {
    name: '帕瓦特奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/UltramanPowered_01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-powered',
    level: '偏门',
  },
  {
    name: '艾斯奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/06/UA_Hero_a01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-ace',
    level: '热门',
  },
  {
    name: '奈欧斯奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/UltramanNeos_01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-neos',
    level: '偏门',
  },
  {
    name: '泰罗奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/06/UT_Hero_taro01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-taro',
    level: '热门',
  },
  {
    name: '爱迪奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/06/U80_Hero_80_01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-80',
    level: '偏门',
  },
  {
    name: '迪迦奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/UltramanTiga_Multi_05_for_confirmation-1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-tiga',
    level: '热门',
  },
  {
    name: '希卡利奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/UltramanHikari_01-1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-hikari',
    level: '偏门',
  },
  {
    name: '赛罗奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2018/02/hero_zero-1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-zero',
    level: '热门',
  },
  {
    name: '风马奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/11/UTAIGA_Hero_fuma01_1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-fuma',
    level: '偏门',
  },
  {
    name: '梦比优斯奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2018/02/hero_mebius-1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-mebius',
    level: '热门',
  },
  {
    name: '泰塔斯奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/11/UTAIGA_Hero_titas01_1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-titas',
    level: '偏门',
  },
  {
    name: '盖亚奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2018/02/hero_gaia-1.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-gaia',
    level: '热门',
  },
  {
    name: '利布特奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/02/UltramanRibut_01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-ribut',
    level: '偏门',
  },
  {
    name: '雷欧奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/06/UL_Hero_leo01.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-leo',
    level: '热门',
  },
  {
    name: '雷古洛斯奥特曼',
    image: 'https://tsuburaya-prod.com/wp-content/uploads/2022/02/IMG_0353.png',
    source: 'https://tsuburaya-prod.com/heroes/ultraman-regulos',
    level: '偏门',
  },
  { name: '奥特曼Omega', image: 'https://tsuburaya-prod.com/wp-content/uploads/2025/04/Hero-Page-thumbnail-Omega.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-omega', level: '热门' },
  { name: '奥特曼Arc', image: 'https://tsuburaya-prod.com/wp-content/uploads/2024/04/ARC.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-arc', level: '热门' },
  { name: '奥特曼Blazar', image: 'https://tsuburaya-prod.com/wp-content/uploads/2023/04/BLAZAR.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-blazar', level: '热门' },
  { name: '德凯奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2022/03/Ultrawoman-Decker-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-decker', level: '热门' },
  { name: '特利迦奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2021/12/Ultraman-Trigger-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-trigger', level: '热门' },
  { name: '泽塔奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes27_zett.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-z', level: '热门' },
  { name: '布鲁奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes22_blu.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-blu', level: '偏门' },
  { name: '罗索奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes21_rosso.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-rosso', level: '偏门' },
  { name: '捷德奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes20_geed.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-geed', level: '热门' },
  { name: '欧布奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes19_orb.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-orb', level: '热门' },
  { name: '艾克斯奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes18_x.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-x', level: '热门' },
  { name: '维克特利奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes17_victory.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-victory', level: '偏门' },
  { name: '银河奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes16_ginga.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-ginga', level: '热门' },
  { name: '麦克斯奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes13_max.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-max', level: '偏门' },
  { name: '奈克瑟斯奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes12_nexus.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-nexus', level: '偏门' },
  { name: '正义奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-Justice-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-justice', level: '偏门' },
  { name: '高斯奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes11_cosmos.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-cosmos', level: '热门' },
  { name: '阿古茹奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-Agul-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-agul', level: '偏门' },
  { name: '戴拿奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes09_dyna.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-dyna', level: '热门' },
  { name: '盖亚奥特曼（V2）', image: 'https://tsuburaya-prod.com/wp-content/uploads/2020/09/heroes10_gaia.jpg', source: 'https://tsuburaya-prod.com/heroes/ultraman-gaia', level: '偏门' },
  { name: '希卡利奥特曼（剑）', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-Hikari-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-hikari', level: '偏门' },
  { name: '超人力霸王奈欧斯', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-Neos-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-neos', level: '偏门' },
  { name: '超人力霸王21', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraseven-21-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraseven-21', level: '偏门' },
  { name: '尤莉安', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-Joneus-Top-1.png', source: 'https://tsuburaya-prod.com/heroes/yullian', level: '偏门' },
  { name: '阿斯特拉', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Astra-Top.png', source: 'https://tsuburaya-prod.com/heroes/astra', level: '偏门' },
  { name: '佐菲奥特曼', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Zoffy-Top.png', source: 'https://tsuburaya-prod.com/heroes/zoffy', level: '热门' },
  { name: '奥特之王', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-King-Top.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-king', level: '热门' },
  { name: '奥特之母', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Mother-of-Ultra-Top.png', source: 'https://tsuburaya-prod.com/heroes/mother-of-ultra', level: '偏门' },
  { name: '奥特之父', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Father-of-Ultra-Top.png', source: 'https://tsuburaya-prod.com/heroes/father-of-ultra', level: '偏门' },
  { name: '奥特曼Powered', image: 'https://tsuburaya-prod.com/wp-content/uploads/2019/05/Ultraman-Powered.png', source: 'https://tsuburaya-prod.com/heroes/ultraman-powered', level: '偏门' },
];

const rankCopy = [
  { min: 0.9, label: '光之国冷门馆长', text: '这份冷热名单已经难不倒你了。' },
  { min: 0.75, label: '宇宙考据员', text: '你认出的，都是藏在角落里的光。' },
  { min: 0.5, label: '特摄资料猎人', text: '热门不丢分，冷门也敢猜。' },
  { min: 0, label: '误入光之国', text: '别灰心，下一轮会认出更多。' },
];

export default function Home() {
  const [mode, setMode] = useState<10 | 20>(10);
  const [started, setStarted] = useState(false);
  const [round, setRound] = useState<Hero[]>(() => heroes.slice(0, 10));
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);
  const hero = round[index] ?? heroes[0];
  const options = useMemo(() => {
    const sameLevel = heroes.filter((item) => item.level === hero.level && item.name !== hero.name);
    const otherLevel = heroes.filter((item) => item.level !== hero.level && item.name !== hero.name);
    const distractors = [...sameLevel, ...otherLevel].map((item) => item.name);
    const choices = [hero.name, ...[0, 1, 2].map((offset) => distractors[(index + offset) % distractors.length])];
    const start = index % choices.length;
    return [...choices.slice(start), ...choices.slice(0, start)];
  }, [hero.level, hero.name, index]);
  const rank = rankCopy.find((item) => score / round.length >= item.min) ?? rankCopy[rankCopy.length - 1];

  useEffect(() => {
    if (!started) return;
    setImageLoading(true);
    let checks = 0;
    const readyTimer = window.setInterval(() => {
      const currentImage = imageRef.current;
      if (currentImage?.complete && currentImage.naturalWidth > 0) {
        setImageLoading(false);
        window.clearInterval(readyTimer);
      } else if (checks++ > 50) {
        window.clearInterval(readyTimer);
        setImageLoading(false);
      }
    }, 100);
    const nextHero = round[index + 1];
    if (nextHero) {
      const preloader = new window.Image();
      preloader.src = nextHero.image;
    }
    return () => window.clearInterval(readyTimer);
  }, [index, round, started]);

  function select(name: string) {
    if (answer || showResult) return;
    setAnswer(name);
    if (name === hero.name) setScore((value) => value + 1);
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
    setRound([...heroes].sort(() => Math.random() - 0.5).slice(0, mode));
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
            <span><b className="block text-lg">奥特曼认脸局</b><small className="text-[10px] tracking-[.16em] text-[#a7b8db]">ULTRA FACE QUIZ</small></span>
          </a>
          {started && <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{showResult ? round.length : index + 1} / {round.length}</span>}
        </header>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-label="答题进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
          <div className="h-full rounded-full bg-[#ffe185] transition-[width] duration-500" style={{ width: `${progress}%` }} />
        </div>

        <section className="py-10 text-center sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#193563] px-3 py-1.5 text-xs font-black text-[#ffe185]"><Sparkles className="size-3.5" />官方角色页素材 · 热门 × 偏门</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">热门冷门，认得出几个？</h1>
          <p className="mt-3 text-sm font-semibold text-[#b8c6df]">50 位光之巨人交叉出题，认错也算涨知识。</p>
          {!started && <><div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">{([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#ffe185] bg-[#253f68]' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}><p className="font-black text-white">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#b8c6df]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}</div><Button type="button" onClick={startGame} className="mx-auto mt-7 h-12 rounded-2xl bg-[#d54545] px-6 font-black text-white hover:bg-[#bd3535]">开始挑战 <ArrowRight className="size-4" /></Button></>}
        </section>

        {started && !showResult ? (
          <>
            <div key={hero.name} className="rounded-[2rem] border border-white/10 bg-[#10264c] p-4 shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-5">
              <div className="relative grid aspect-[16/10] place-items-center overflow-hidden rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,#193563_0%,#0d1d3c_55%,#071632_100%)]">
                <img
                  src={hero.image}
                  ref={imageRef}
                  alt={hero.name}
                  loading="eager"
                  decoding="async"
                  className="size-full object-contain p-4 transition-transform duration-500 hover:scale-[1.03] sm:p-7"
                  onLoad={() => setImageLoading(false)}
                  onError={(event) => {
                    setImageLoading(false);
                    event.currentTarget.style.display = 'none';
                    const fallback = event.currentTarget.nextElementSibling;
                    if (fallback instanceof HTMLElement) fallback.style.display = 'grid';
                  }}
                />
                {imageLoading && <div className="absolute inset-0 grid place-items-center bg-[#0b1b38]/80 p-8 text-center"><div><span className="mx-auto grid size-10 place-items-center rounded-2xl border-2 border-[#ffe185]/30 border-t-[#ffe185] text-[#ffe185] animate-spin" /><p className="mt-3 text-sm font-bold text-[#c4d2e8]">正在加载官方图片…</p></div></div>}
                <div className="absolute inset-0 hidden place-items-center bg-[#0b1b38] p-8 text-center" aria-live="polite">
                  <div><p className="text-3xl font-black text-[#ffe185]">{hero.name}</p><p className="mt-2 text-sm text-[#b8c6df]">官方图片暂时加载失败，请稍后重试</p></div>
                </div>
              </div>
            </div>

            <section className="mt-6" aria-label="选择答案">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-[#a7b8db]"><span>第 {index + 1} 题</span><span>{hero.level}题 · 看图选名字</span></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {options.map((name, optionIndex) => {
                  const correct = answer !== null && name === hero.name;
                  const wrong = answer === name && name !== hero.name;
                  return <Button key={name} type="button" onClick={() => select(name)} disabled={answer !== null} variant="outline" className={`h-[62px] justify-start rounded-2xl border-white/15 bg-white/5 px-5 text-left font-black text-white transition-all hover:bg-white/10 disabled:cursor-default disabled:opacity-100 ${correct ? 'border-[#61d5ad] bg-[#17423d] text-[#d9fff1]' : ''} ${wrong ? 'border-[#f28a78] bg-[#512d3b] text-[#ffe5de]' : ''}`}><span className={`mr-3 grid size-7 place-items-center rounded-lg text-xs ${correct ? 'bg-[#61d5ad] text-[#0b2a27]' : wrong ? 'bg-[#f28a78] text-[#381925]' : 'bg-white/10 text-[#ffe185]'}`}>{correct ? <Check className="size-4" /> : wrong ? <X className="size-4" /> : String.fromCharCode(65 + optionIndex)}</span>{name}</Button>;
                })}
              </div>
            </section>

            {answer && (
              <div className={`mt-5 rounded-3xl border p-5 ${answer === hero.name ? 'border-[#61d5ad]/30 bg-[#17423d]' : 'border-[#f28a78]/30 bg-[#3d2947]'}`} aria-live="polite">
                <div className="flex items-start gap-3"><span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl ${answer === hero.name ? 'bg-[#61d5ad] text-[#0b2a27]' : 'bg-[#f28a78] text-[#381925]'}`}>{answer === hero.name ? <Check className="size-4" /> : <X className="size-4" />}</span><div><p className="font-black">{answer === hero.name ? '答对了！' : '差一点，这题认的是：' + hero.name}</p><p className="mt-2 text-sm text-[#c4d2e8]">答案来自圆谷官方角色页，想看完整资料可以点这里。</p><a href={hero.source} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#ffe185] underline decoration-white/20 underline-offset-4">查看官方角色页 <ExternalLink className="size-3" /></a></div></div>
                <Button type="button" onClick={next} className="mt-5 h-11 rounded-2xl bg-[#d54545] px-5 font-black text-white shadow-[0_6px_20px_rgba(213,69,69,.25)] hover:bg-[#bd3535]">{index === round.length - 1 ? '查看成绩' : '下一题'} <ArrowRight className="size-4" /></Button>
              </div>
            )}
          </>
        ) : started && showResult ? (
          <section className="rounded-[2rem] border border-white/10 bg-[#163765] p-7 text-center shadow-[0_24px_70px_rgba(0,0,0,.25)] sm:p-9">
            <p className="text-sm font-black tracking-[.14em] text-[#ffe185]">冷热认脸完成</p>
            <p className="mt-3 text-6xl font-black">{score}<span className="text-2xl text-[#b8c6df]"> / {round.length}</span></p>
            <h2 className="mt-6 text-2xl font-black">{rank.label}</h2>
            <p className="mt-2 text-sm text-[#b8c6df]">{rank.text}</p>
            <Button type="button" onClick={restart} className="mt-7 h-11 rounded-2xl bg-[#d54545] px-5 font-black text-white hover:bg-[#bd3535]"><RotateCcw className="size-4" />再认一轮</Button>
          </section>
        ) : null}
        <Community quizName="奥特曼认脸局" tone="sky" />
      </div>
    </main>
  );
}
