'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Leaf,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Community } from '@/components/community';

type Question = {
  name: string;
  scientificName: string;
  imageSearchNames?: string[];
  poisonous: boolean;
};

const questions: Question[] = [
  { name: '毒蝇鹅膏', scientificName: 'Amanita muscaria', poisonous: true },
  { name: '致命鹅膏', scientificName: 'Amanita phalloides', poisonous: true },
  { name: '豹斑鹅膏', scientificName: 'Amanita pantherina', poisonous: true },
  { name: '白毒伞', scientificName: 'Amanita virosa', poisonous: true },
  { name: '致命小皮伞', scientificName: 'Galerina marginata', poisonous: true },
  { name: '绿褶菇', scientificName: 'Chlorophyllum molybdites', poisonous: true },
  { name: '卷边桩菇', scientificName: 'Paxillus involutus', poisonous: true },
  { name: '红变丝盖伞', scientificName: 'Inocybe erubescens', poisonous: true },
  { name: '肉褐鳞环柄菇', scientificName: 'Lepiota brunneoincarnata', poisonous: true },
  { name: '簇生黄韧伞', scientificName: 'Hypholoma fasciculare', poisonous: true },
  { name: '香菇', scientificName: 'Lentinula edodes', poisonous: false },
  { name: '平菇', scientificName: 'Pleurotus ostreatus', poisonous: false },
  { name: '木耳', scientificName: 'Auricularia auricula-judae', poisonous: false },
  { name: '鸡油菌', scientificName: 'Cantharellus cibarius', poisonous: false },
  { name: '猴头菇', scientificName: 'Hericium erinaceus', poisonous: false },
  { name: '双孢蘑菇', scientificName: 'Agaricus bisporus', poisonous: false },
  { name: '美味牛肝菌', scientificName: 'Boletus edulis', poisonous: false },
  { name: '灰树花', scientificName: 'Grifola frondosa', poisonous: false },
  { name: '野生金针菇', scientificName: 'Flammulina velutipes', poisonous: false },
  { name: '灵芝', scientificName: 'Ganoderma lingzhi', imageSearchNames: ['Ganoderma lingzhi', 'Ganoderma lucidum'], poisonous: false },
  { name: '毒粉褶菌', scientificName: 'Entoloma sinuatum', poisonous: true },
  { name: '鹿花菌', scientificName: 'Gyromitra esculenta', poisonous: true },
  { name: '发光侧耳', scientificName: 'Omphalotus olearius', poisonous: true },
  { name: '红褐毒伞', scientificName: 'Cortinarius rubellus', poisonous: true },
  { name: '秋日毒伞', scientificName: 'Cortinarius orellanus', poisonous: true },
  { name: '红网牛肝菌', scientificName: 'Rubroboletus satanas', poisonous: true },
  { name: '金盖鹅膏', scientificName: 'Amanita gemmata', poisonous: true },
  { name: '史密斯鹅膏', scientificName: 'Amanita smithiana', poisonous: true },
  { name: '亚黄鹅膏', scientificName: 'Amanita subjunquillea', poisonous: true },
  { name: '西部毁灭天使', scientificName: 'Amanita ocreata', poisonous: true },
  { name: '豹斑口蘑', scientificName: 'Tricholoma pardinum', poisonous: true },
  { name: '呕吐红菇', scientificName: 'Russula emetica', poisonous: true },
  { name: '白霜杯伞', scientificName: 'Clitocybe dealbata', poisonous: true },
  { name: '白丝盖伞', scientificName: 'Inocybe geophylla', poisonous: true },
  { name: '大青褶伞', scientificName: 'Chlorophyllum brunneum', poisonous: true },
  { name: '杏鲍菇', scientificName: 'Pleurotus eryngii', poisonous: false },
  { name: '草菇', scientificName: 'Volvariella volvacea', poisonous: false },
  { name: '羊肚菌', scientificName: 'Morchella esculenta', poisonous: false },
  { name: '黑松露', scientificName: 'Tuber melanosporum', poisonous: false },
  { name: '红汁乳菇', scientificName: 'Lactarius deliciosus', poisonous: false },
  { name: '鸡枞菌', scientificName: 'Termitomyces albuminosus', poisonous: false },
  { name: '竹荪', scientificName: 'Phallus indusiatus', poisonous: false },
  { name: '松茸', scientificName: 'Tricholoma matsutake', poisonous: false },
  { name: '红柄牛肝菌', scientificName: 'Boletus pinophilus', poisonous: false },
  { name: '黑木耳', scientificName: 'Auricularia heimuer', poisonous: false },
  { name: '银耳', scientificName: 'Tremella fuciformis', poisonous: false },
  { name: '茶树菇', scientificName: 'Cyclocybe aegerita', poisonous: false },
  { name: '滑子菇', scientificName: 'Pholiota nameko', poisonous: false },
  { name: '真姬菇', scientificName: 'Hypsizygus marmoreus', poisonous: false },
  { name: '鸡腿菇', scientificName: 'Coprinus comatus', poisonous: false },
];

const shuffle = (items: Question[]) => [...items].sort(() => Math.random() - 0.5);

function resultFor(score: number, total: number) {
  const ratio = total ? score / total : 0;
  if (ratio < 0.2) {
    return {
      title: '答应我，这辈子离蘑菇远一点',
      copy: '树林里的伞盖暂时还赢了。',
      accent: 'from-rose-100 to-orange-50',
    };
  }
  if (ratio < 0.4) {
    return { title: '雨后路人', copy: '雨停了，你还在寻找第一朵蘑菇。', accent: 'from-amber-100 to-yellow-50' };
  }
  if (ratio < 0.65) {
    return { title: '真菌巡游者', copy: '潮湿的落叶之间，你已能辨认一些线索。', accent: 'from-lime-100 to-emerald-50' };
  }
  if (ratio < 0.85) {
    return { title: '孢子大师', copy: '林间的伞盖，正悄悄向你报出名字。', accent: 'from-emerald-100 to-teal-50' };
  }
  return { title: '蘑菇博士', copy: '雨后的树林，已经瞒不过你了。', accent: 'from-teal-100 to-cyan-50' };
}

export default function Home() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [mode, setMode] = useState<10 | 20>(10);
  const [gameQuestions, setGameQuestions] = useState<Question[]>(questions.slice(0, 10));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageState, setImageState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const question = gameQuestions[questionIndex] ?? gameQuestions[0];
  const result = useMemo(() => resultFor(score, gameQuestions.length), [score, gameQuestions.length]);
  const completedCount = questionIndex + (answer === null ? 0 : 1);
  const progressValue = (completedCount / gameQuestions.length) * 100;

  useEffect(() => {
    if (phase !== 'playing') return;

    const controller = new AbortController();
    setImageState('loading');
    setImageUrl(null);
    const loadImage = async () => {
      const names = question.imageSearchNames ?? [question.scientificName];

      for (const taxonName of names) {
        const params = new URLSearchParams({
          taxon_name: taxonName,
          quality_grade: 'research',
          photo_license: 'cc0,cc-by,cc-by-nc,cc-by-sa,cc-by-nc-sa',
          photos: 'true',
          order_by: 'votes',
          order: 'desc',
          per_page: '20',
        });
        const response = await fetch(`https://api.inaturalist.org/v1/observations?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) continue;
        const data = await response.json();
        const photo = data?.results?.find((observation: { photos?: { url?: string }[] }) => observation.photos?.[0]?.url)?.photos?.[0];
        if (photo?.url) return photo.url.replace('square', 'large');
      }

      throw new Error('No image found');
    };

    loadImage()
      .then((url) => {
        setImageUrl(url);
        setImageState('ready');
      })
      .catch((error: unknown) => {
        if (!(error instanceof Error) || error.name !== 'AbortError') setImageState('error');
      });

    return () => controller.abort();
  }, [phase, questionIndex]);

  const startGame = () => {
    setGameQuestions(shuffle(questions).slice(0, mode));
    setQuestionIndex(0);
    setScore(0);
    setAnswer(null);
    setPhase('playing');
  };

  const choose = (choice: boolean) => {
    if (answer !== null) return;
    setAnswer(choice);
    if (choice === question.poisonous) setScore((current) => current + 1);
  };

  const next = () => {
    if (questionIndex === gameQuestions.length - 1) {
      setPhase('result');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setAnswer(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f2e9] text-[#1d3025]">
      <div aria-hidden="true" className="forest-glow absolute inset-x-0 top-0 h-[540px]" />
      <div aria-hidden="true" className="spore-field absolute inset-0 opacity-40" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#1e4a38] text-[#f7f1de] shadow-[0_8px_20px_rgba(28,72,54,0.2)]"><Sprout className="size-5" strokeWidth={2.2} /></span>
            <div><p className="font-serif text-lg font-black tracking-[0.14em] text-[#173827]">蘑菇大师</p><p className="text-[10px] font-bold tracking-[0.15em] text-[#6c7d6e]">MUSHROOM QUIZ</p></div>
          </div>
          {phase === 'playing' && <span className="rounded-full border border-[#cbd7c5] bg-[#f9faf4]/80 px-3 py-1.5 text-xs font-bold text-[#45634f]">{answer === null ? `${questionIndex + 1} / ${gameQuestions.length}` : `已完成 ${completedCount} / ${gameQuestions.length}`}</span>}
        </header>

        {phase === 'intro' && (
          <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-14 text-center sm:py-20">
            <div className="mb-7 flex justify-center"><span className="inline-flex items-center gap-2 rounded-full border border-[#c5d1bf] bg-[#fcfcf7]/80 px-4 py-2 text-sm font-bold text-[#4c6654] shadow-sm"><Sparkles className="size-4 text-[#b46c3e]" />50 题库 · 看图判断毒不毒</span></div>
            <h1 className="font-serif text-5xl font-black leading-[1.08] tracking-tight text-[#173827] sm:text-7xl">这朵蘑菇<br /><span className="text-[#b65d3d]">有毒吗？</span></h1>
            <p className="mt-9 font-serif text-xl font-bold text-[#46604e] sm:text-2xl">选个档位，看看你是不是蘑菇博士。</p>
            <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">
              {([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#1e4a38] bg-[#e7f0e5] shadow-sm' : 'border-[#d5dfd0] bg-[#fcfcf7]/80 hover:bg-white'}`}><p className="font-black text-[#173827]">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#6c7d6e]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}
            </div>
            <Button onClick={startGame} size="lg" className="mx-auto mt-7 h-12 rounded-2xl bg-[#1e4a38] px-6 text-base font-bold text-[#fffbed] shadow-[0_12px_24px_rgba(30,74,56,0.22)] hover:bg-[#163a2b]">开始测试 <ArrowRight className="size-4" /></Button>
            <p className="mt-5 text-xs text-[#788579]">仅供趣味测试，野生蘑菇不可凭图片判断是否可食用。</p>
          </section>
        )}

        {phase === 'playing' && (
          <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8 sm:py-12">
            <div className="mb-7 flex items-center gap-4 sm:mb-9"><div role="progressbar" aria-label="答题进度" aria-valuemin={0} aria-valuemax={gameQuestions.length} aria-valuenow={completedCount} className="h-1 flex-1 overflow-hidden rounded-full bg-[#dce4d8]"><div className="h-full rounded-full bg-[#b65d3d] transition-[width] duration-500" style={{ width: `${progressValue}%` }} /></div><span className="text-xs font-bold text-[#6a796e]">{answer === null ? `第 ${questionIndex + 1} 题` : `已完成 ${completedCount} 题`}</span></div>
            <div className="overflow-hidden rounded-[2rem] border border-[#d8ded0] bg-[#fbfbf6]/95 p-3 shadow-[0_24px_60px_rgba(30,57,41,0.11)] sm:p-4">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] bg-[#1d392c]">
                {imageState === 'ready' && imageUrl ? <img src={imageUrl} alt="等待判断的蘑菇" className="size-full bg-[#172b21] object-contain" onError={() => setImageState('error')} /> : <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#54735a_0%,#284637_42%,#173126_100%)] text-center text-[#edf1df]">{imageState === 'error' ? <div><Sprout className="mx-auto size-9 opacity-80" /><p className="mt-3 text-sm font-bold">这朵蘑菇躲进雾里了</p><p className="mt-1 text-xs text-[#cdd9c8]">请进入下一题继续测试</p></div> : <div><LoaderCircle className="mx-auto size-8 animate-spin text-[#e4ca99]" /><p className="mt-3 text-sm font-bold">雨后的树林正在显影…</p></div>}</div>}
              </div>
            </div>
            <div className="mt-7 text-center sm:mt-9"><p className="text-sm font-black tracking-[0.16em] text-[#b65d3d]">{answer === null ? `第 ${questionIndex + 1} / ${gameQuestions.length} 题` : `已完成 ${completedCount} / ${gameQuestions.length} 题`}</p><h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#173827] sm:text-4xl">这朵蘑菇，有毒吗？</h2></div>
            {answer === null ? (
              <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 sm:mt-9 sm:gap-4"><Button onClick={() => choose(true)} variant="outline" className="h-16 rounded-2xl border-[#e6b9a7] bg-[#fff9f4] text-base font-black text-[#b54f35] hover:bg-[#fceadf]">有毒</Button><Button onClick={() => choose(false)} variant="outline" className="h-16 rounded-2xl border-[#b9d6c2] bg-[#f8fdf7] text-base font-black text-[#287047] hover:bg-[#e9f7e9]">无毒</Button></div>
            ) : (
              <div className={`mx-auto mt-7 w-full max-w-xl rounded-3xl border p-5 sm:mt-9 sm:p-6 ${answer === question.poisonous ? 'border-[#b7d8bd] bg-[#eff9ef]' : 'border-[#efc3b1] bg-[#fff2eb]'}`}>
                <div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${answer === question.poisonous ? 'bg-[#267345] text-white' : 'bg-[#c1573c] text-white'}`}>{answer === question.poisonous ? <Check className="size-6" /> : <X className="size-6" />}</span><div className="min-w-0 flex-1"><p className={`text-lg font-black ${answer === question.poisonous ? 'text-[#1f673c]' : 'text-[#a94731]'}`}>{answer === question.poisonous ? '答对了！' : '答错了'}</p><p className="mt-1 text-sm text-[#516657]">正确答案：<strong className="text-[#1d3025]">{question.poisonous ? '有毒' : '无毒'}</strong></p><p className="mt-1 text-sm text-[#516657]">名称：<strong className="text-[#1d3025]">{question.name}</strong></p></div></div>
                <Button onClick={next} className="mt-5 h-11 w-full rounded-2xl bg-[#1e4a38] text-base font-bold text-[#fffbed] hover:bg-[#163a2b]">{questionIndex === gameQuestions.length - 1 ? '查看结果' : `进入第 ${questionIndex + 2} 题`} <ArrowRight className="size-4" /></Button>
              </div>
            )}
          </section>
        )}

        {phase === 'result' && (
          <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12 text-center"><div className={`rounded-[2rem] border border-[#d6ddd0] bg-gradient-to-br ${result.accent} p-7 shadow-[0_24px_60px_rgba(30,57,41,0.12)] sm:p-10`}><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#1e4a38] text-[#fff6df] shadow-lg"><Leaf className="size-8" /></span><p className="mt-7 text-sm font-black tracking-[0.16em] text-[#b65d3d]">你的成绩</p><p className="mt-2 font-serif text-6xl font-black text-[#173827]">{score}<span className="text-2xl text-[#4d6754]"> / {gameQuestions.length}</span></p><h1 className="mt-7 font-serif text-3xl font-black leading-tight text-[#173827] sm:text-4xl">{result.title}</h1><p className="mt-4 text-base text-[#496252]">{result.copy}</p><Button onClick={startGame} size="lg" className="mt-9 h-12 rounded-2xl bg-[#1e4a38] px-6 text-base font-bold text-[#fffbed] hover:bg-[#163a2b]"><RotateCcw className="size-4" /> 再测一次</Button></div><p className="mt-6 text-xs text-[#788579]">仅供趣味测试，野生蘑菇不可凭图片判断是否可食用。</p></section>
        )}
        <Community quizName="蘑菇大师" tone="forest" />
        <footer className="pt-5 text-center text-xs font-medium text-[#809084]">偏门鉴定所 · 雨后特别卷</footer>
      </div>
    </main>
  );
}
