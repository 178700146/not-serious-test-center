'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Bird, Check, LoaderCircle, RotateCcw, Sparkles, Telescope, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Community } from '@/components/community';

type BirdQuestion = {
  name: string;
  scientificName: string;
  imageSearchNames?: string[];
};

type GameQuestion = BirdQuestion & { options: string[] };

const birds: BirdQuestion[] = [
  { name: '戴胜', scientificName: 'Upupa epops' },
  { name: '普通翠鸟', scientificName: 'Alcedo atthis' },
  { name: '鸳鸯', scientificName: 'Aix galericulata' },
  { name: '白头鹎', scientificName: 'Pycnonotus sinensis' },
  { name: '红嘴蓝鹊', scientificName: 'Urocissa erythroryncha' },
  { name: '喜鹊', scientificName: 'Pica serica', imageSearchNames: ['Pica serica', 'Pica pica'] },
  { name: '黑枕黄鹂', scientificName: 'Oriolus chinensis' },
  { name: '北红尾鸲', scientificName: 'Phoenicurus auroreus' },
  { name: '红尾伯劳', scientificName: 'Lanius cristatus' },
  { name: '黄眉柳莺', scientificName: 'Phylloscopus inornatus' },
  { name: '暗绿绣眼鸟', scientificName: 'Zosterops simplex', imageSearchNames: ['Zosterops simplex', 'Zosterops japonicus'] },
  { name: '银喉长尾山雀', scientificName: 'Aegithalos glaucogularis' },
  { name: '八哥', scientificName: 'Acridotheres cristatellus' },
  { name: '普通朱雀', scientificName: 'Carpodacus erythrinus' },
  { name: '黑尾蜡嘴雀', scientificName: 'Eophona migratoria' },
  { name: '白鹡鸰', scientificName: 'Motacilla alba' },
  { name: '灰喜鹊', scientificName: 'Cyanopica cyanus' },
  { name: '白眉鹀', scientificName: 'Emberiza tristrami' },
  { name: '红隼', scientificName: 'Falco tinnunculus' },
  { name: '苍鹭', scientificName: 'Ardea cinerea' },
  { name: '乌鸫', scientificName: 'Turdus merula' },
  { name: '大山雀', scientificName: 'Parus major' },
  { name: '灰椋鸟', scientificName: 'Spodiopsar cineraceus' },
  { name: '珠颈斑鸠', scientificName: 'Spilopelia chinensis' },
  { name: '山斑鸠', scientificName: 'Streptopelia orientalis' },
  { name: '环颈雉', scientificName: 'Phasianus colchicus' },
  { name: '小白鹭', scientificName: 'Egretta garzetta' },
  { name: '大白鹭', scientificName: 'Ardea alba' },
  { name: '夜鹭', scientificName: 'Nycticorax nycticorax' },
  { name: '池鹭', scientificName: 'Ardeola bacchus' },
  { name: '灰雁', scientificName: 'Anser anser' },
  { name: '绿头鸭', scientificName: 'Anas platyrhynchos' },
  { name: '赤麻鸭', scientificName: 'Tadorna ferruginea' },
  { name: '黑水鸡', scientificName: 'Gallinula chloropus' },
  { name: '白骨顶', scientificName: 'Fulica atra' },
  { name: '普通鵟', scientificName: 'Buteo japonicus' },
  { name: '凤头鹰', scientificName: 'Accipiter trivirgatus' },
  { name: '红脚隼', scientificName: 'Falco amurensis' },
  { name: '普通燕鸥', scientificName: 'Sterna hirundo' },
  { name: '楼燕', scientificName: 'Apus apus' },
  { name: '家燕', scientificName: 'Hirundo rustica' },
  { name: '金腰燕', scientificName: 'Cecropis daurica' },
  { name: '大嘴乌鸦', scientificName: 'Corvus macrorhynchos' },
  { name: '灰树鹊', scientificName: 'Dendrocitta formosae' },
  { name: '画眉', scientificName: 'Garrulax canorus' },
  { name: '雀鹰', scientificName: 'Accipiter nisus' },
  { name: '普通鸬鹚', scientificName: 'Phalacrocorax carbo' },
  { name: '白胸苦恶鸟', scientificName: 'Amaurornis phoenicurus' },
  { name: '普通夜鹰', scientificName: 'Caprimulgus europaeus' },
  { name: '斑嘴鸭', scientificName: 'Anas poecilorhyncha' },
];

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function createGameQuestions(count: 10 | 20 = 10) {
  return shuffle(birds).slice(0, count).map((bird) => ({
    ...bird,
    options: shuffle([
      bird.name,
      ...shuffle(birds.filter((candidate) => candidate.name !== bird.name)).slice(0, 3).map((candidate) => candidate.name),
    ]),
  }));
}

function resultFor(score: number, total: number) {
  const ratio = total ? score / total : 0;
  if (ratio < 0.2) return { title: '望远镜先别收', copy: '没关系，鸟在看你。', accent: 'from-[#f4e6bd] to-[#dce9e6]' };
  if (ratio < 0.4) return { title: '清晨抬头的人', copy: '风一吹，你已经开始留意树梢。', accent: 'from-[#e3edd7] to-[#d7e7ea]' };
  if (ratio < 0.65) return { title: '林边记录员', copy: '有些羽色和叫声，已经被你悄悄记住。', accent: 'from-[#d9eadf] to-[#cde3e7]' };
  if (ratio < 0.85) return { title: '羽色侦探', copy: '翅膀一掠而过，你也能抓住线索。', accent: 'from-[#cddfe5] to-[#e1dce9]' };
  return { title: '观鸟大师', copy: '天空里每一次振翅，都瞒不过你了。', accent: 'from-[#c9dfe4] to-[#d9e5c4]' };
}

export default function Home() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [mode, setMode] = useState<10 | 20>(10);
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>(() => createGameQuestions(10));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageCandidates, setImageCandidates] = useState<string[]>([]);
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
    setImageCandidates([]);

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
        const data = await response.json() as { results?: { photos?: { url?: string }[] }[] };
        const photos = (data?.results ?? [])
          .flatMap((observation: { photos?: { url?: string }[] }) => observation.photos ?? [])
          .map((photo: { url?: string }) => photo.url?.replace('square', 'large'))
          .filter((url: string | undefined): url is string => Boolean(url));
        const uniquePhotos = [...new Set<string>(photos)];
        if (uniquePhotos.length) return uniquePhotos.slice(0, 12);
      }
      throw new Error('No image found');
    };

    loadImage()
      .then((urls) => {
        setImageCandidates(urls);
        setImageUrl(urls[Math.floor(Math.random() * urls.length)]);
        setImageState('ready');
      })
      .catch((error: unknown) => {
        if (!(error instanceof Error) || error.name !== 'AbortError') setImageState('error');
      });

    return () => controller.abort();
  }, [phase, questionIndex]);

  const startGame = () => {
    setGameQuestions(createGameQuestions(mode));
    setQuestionIndex(0);
    setScore(0);
    setAnswer(null);
    setPhase('playing');
  };

  const choose = (choice: string) => {
    if (answer !== null) return;
    setAnswer(choice);
    if (choice === question.name) setScore((current) => current + 1);
  };

  const next = () => {
    if (questionIndex === gameQuestions.length - 1) {
      setPhase('result');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setAnswer(null);
  };

  const changePhoto = () => {
    if (imageCandidates.length < 2) return;
    const alternatives = imageCandidates.filter((candidate) => candidate !== imageUrl);
    setImageUrl(alternatives[Math.floor(Math.random() * alternatives.length)] ?? imageCandidates[0]);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf3ee] text-[#183237]">
      <div aria-hidden="true" className="sky-wash absolute inset-x-0 top-0 h-[520px]" />
      <div aria-hidden="true" className="feather-field absolute inset-0 opacity-50" />

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between gap-3">
          <a href="/" className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-[#1e5360] text-[#f4e6b5] shadow-[0_8px_20px_rgba(30,83,96,.2)]"><Bird className="size-5" strokeWidth={2.2} /></span><span><span className="block font-serif text-lg font-black tracking-[0.12em] text-[#17404a]">观鸟大师</span><span className="block text-[10px] font-bold tracking-[0.15em] text-[#67808a]">BIRD QUIZ</span></span></a>
          {phase === 'playing' && <span className="rounded-full border border-[#c8d8d2] bg-[#f8fcf9]/80 px-3 py-1.5 text-xs font-bold text-[#42646a]">{answer === null ? `${questionIndex + 1} / ${gameQuestions.length}` : `已完成 ${completedCount} / ${gameQuestions.length}`}</span>}
        </header>

        {phase === 'intro' && <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-14 text-center sm:py-20"><div className="mb-7 flex justify-center"><span className="inline-flex items-center gap-2 rounded-full border border-[#bfd3cc] bg-[#f8fcf8]/85 px-4 py-2 text-sm font-bold text-[#3f6566] shadow-sm"><Sparkles className="size-4 text-[#bf7d48]" />50 题库 · 中国野鸟</span></div><h1 className="font-serif text-5xl font-black leading-[1.08] tracking-tight text-[#17404a] sm:text-7xl">你认得出<br /><span className="text-[#bf7047]">这些鸟吗？</span></h1><p className="mt-9 font-serif text-xl font-bold text-[#46656a] sm:text-2xl">选个档位，看看你是不是观鸟大师。</p><div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">{([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#1e5360] bg-[#e6f1ef] shadow-sm' : 'border-[#cbdcd6] bg-[#f8fcf8]/80 hover:bg-white'}`}><p className="font-black text-[#17404a]">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#67808a]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}</div><Button onClick={startGame} size="lg" className="mx-auto mt-7 h-12 rounded-2xl bg-[#1e5360] px-6 text-base font-bold text-[#fffbed] shadow-[0_12px_24px_rgba(30,83,96,.22)] hover:bg-[#163f49]">开始识鸟 <ArrowRight className="size-4" /></Button><p className="mt-5 text-xs text-[#70858a]">图片来自自然观察记录，仅供趣味识鸟。</p></section>}

        {phase === 'playing' && <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8 sm:py-12"><div className="mb-7 flex items-center gap-4 sm:mb-9"><div role="progressbar" aria-label="答题进度" aria-valuemin={0} aria-valuemax={gameQuestions.length} aria-valuenow={completedCount} className="h-1 flex-1 overflow-hidden rounded-full bg-[#d2e1dc]"><div className="h-full rounded-full bg-[#bf7047] transition-[width] duration-500" style={{ width: `${progressValue}%` }} /></div><span className="text-xs font-bold text-[#587177]">{answer === null ? `第 ${questionIndex + 1} 题` : `已完成 ${completedCount} 题`}</span></div><div className="overflow-hidden rounded-[2rem] border border-[#d0dfd9] bg-[#fbfdf9]/95 p-3 shadow-[0_24px_60px_rgba(28,70,75,.1)] sm:p-4"><div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] bg-[#214c55]">{imageState === 'ready' && imageUrl ? <><img src={imageUrl} alt="等待识别的野生鸟" className="size-full bg-[#193c44] object-cover" onError={() => setImageState('error')} />{answer === null && imageCandidates.length > 1 && <button type="button" onClick={changePhoto} className="absolute bottom-3 right-3 rounded-full bg-[#f9fcf8]/90 px-3 py-1.5 text-xs font-black text-[#24535b] shadow-sm hover:bg-white">换一张清楚的</button>}</> : <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#5e8990_0%,#2d5960_45%,#173943_100%)] text-center text-[#eff4e6]">{imageState === 'error' ? <div><Bird className="mx-auto size-9 opacity-80" /><p className="mt-3 text-sm font-bold">这只鸟飞进云里了</p><p className="mt-1 text-xs text-[#cbd9d3]">仍可继续作答，下一题会换一只鸟</p></div> : <div><LoaderCircle className="mx-auto size-8 animate-spin text-[#e6cb8d]" /><p className="mt-3 text-sm font-bold">树林正在传来翅膀声…</p></div>}</div>}</div></div><div className="mt-7 text-center sm:mt-9"><p className="text-sm font-black tracking-[0.16em] text-[#bf7047]">{answer === null ? `第 ${questionIndex + 1} / ${gameQuestions.length} 题` : `已完成 ${completedCount} / ${gameQuestions.length} 题`}</p><h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#17404a] sm:text-4xl">这是什么鸟？</h2></div>{answer === null ? <div className="mx-auto mt-7 grid w-full max-w-2xl grid-cols-1 gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4">{question.options.map((option, index) => <Button key={option} onClick={() => choose(option)} variant="outline" className="h-16 justify-start rounded-2xl border-[#cadad4] bg-[#fbfdf9] px-5 text-left text-base font-black text-[#28545b] hover:border-[#89aaa5] hover:bg-[#f1f8f5]"><span className="mr-3 grid size-7 place-items-center rounded-full bg-[#e3eee9] text-xs text-[#486d70]">{String.fromCharCode(65 + index)}</span>{option}</Button>)}</div> : <div className={`mx-auto mt-7 w-full max-w-2xl rounded-3xl border p-5 sm:mt-9 sm:p-6 ${answer === question.name ? 'border-[#b7d8bd] bg-[#eff9ef]' : 'border-[#edc5b4] bg-[#fff3ed]'}`}><div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${answer === question.name ? 'bg-[#267365] text-white' : 'bg-[#c0694e] text-white'}`}>{answer === question.name ? <Check className="size-6" /> : <X className="size-6" />}</span><div className="min-w-0 flex-1"><p className={`text-lg font-black ${answer === question.name ? 'text-[#1f6759]' : 'text-[#a84d38]'}`}>{answer === question.name ? '答对了！' : '答错了'}</p><p className="mt-1 text-sm text-[#506a6a]">正确答案：<strong className="text-[#183237]">{question.name}</strong></p><p className="mt-1 text-sm text-[#506a6a]">学名：<strong className="text-[#183237]">{question.scientificName}</strong></p></div></div><Button onClick={next} className="mt-5 h-11 w-full rounded-2xl bg-[#1e5360] text-base font-bold text-[#fffbed] hover:bg-[#163f49]">{questionIndex === gameQuestions.length - 1 ? '查看结果' : `进入第 ${questionIndex + 2} 题`} <ArrowRight className="size-4" /></Button></div>}</section>}

        {phase === 'result' && <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12 text-center"><div className={`rounded-[2rem] border border-[#d1ddd8] bg-gradient-to-br ${result.accent} p-7 shadow-[0_24px_60px_rgba(28,70,75,.11)] sm:p-10`}><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#1e5360] text-[#fff5d8] shadow-lg"><Telescope className="size-8" /></span><p className="mt-7 text-sm font-black tracking-[0.16em] text-[#bf7047]">你的成绩</p><p className="mt-2 font-serif text-6xl font-black text-[#17404a]">{score}<span className="text-2xl text-[#4d6a70]"> / {gameQuestions.length}</span></p><h1 className="mt-7 font-serif text-3xl font-black leading-tight text-[#17404a] sm:text-4xl">{result.title}</h1><p className="mt-4 text-base text-[#49656a]">{result.copy}</p><Button onClick={startGame} size="lg" className="mt-9 h-12 rounded-2xl bg-[#1e5360] px-6 text-base font-bold text-[#fffbed] hover:bg-[#163f49]"><RotateCcw className="size-4" /> 再测一次</Button></div><p className="mt-6 text-xs text-[#70858a]">图片来自自然观察记录，仅供趣味识鸟。</p></section>}
        <Community quizName="观鸟大师" tone="sky" />
        <footer className="pt-5 text-center text-xs font-medium text-[#7c9295]">不太正经测试中心 · 空中观察卷</footer>
      </div>
    </main>
  );
}
