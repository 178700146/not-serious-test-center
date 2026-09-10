'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Check, CircleHelp, ExternalLink, MapPin, RotateCcw, Sparkles, Volume2, X, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Community } from '@/components/community';

type DialectClue = {
  province: string;
  provinceLabel: string;
  city: string;
  dialect: string;
  sentence: string;
  audioUrl: string;
  sourceUrl: string;
  license: string;
};

const seedClues: DialectClue[] = [
  {
    province: '北京', provinceLabel: '北京市', city: '北京', dialect: '北京话', sentence: '维基百科，自由的百科全书',
    audioUrl: '/audio/dialect/beijing.ogg', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh-dialect_Beijing_sample.ogg', license: 'CC BY-SA 3.0',
  },
  {
    province: '天津', provinceLabel: '天津市', city: '天津·河西', dialect: '天津话', sentence: '维基百科，自由的百科全书',
    audioUrl: '/audio/dialect/tianjin.oga', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh,_cmn,_jlua,_Tianjin_dialect_(Hexi),_维基百科,_自由的百科全书.oga', license: 'CC0',
  },
  {
    province: '河北', provinceLabel: '河北省', city: '邯郸', dialect: '邯郸话', sentence: '维基百科，自由的百科全书',
    audioUrl: '/audio/dialect/hebei.oga', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh,_cmn,_jlua,_Handan_Dialect,_维基百科,_自由的百科全书.oga', license: 'CC0',
  },
  {
    province: '山东', provinceLabel: '山东省', city: '济南', dialect: '济南话', sentence: '维基百科，自由的百科全书',
    audioUrl: '/audio/dialect/shandong.oga', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh,_cmn,_jlua,_Jinan_Dialect,_维基百科,_自由的百科全书.oga', license: 'CC BY-SA 4.0',
  },
  {
    province: '重庆', provinceLabel: '重庆市', city: '重庆', dialect: '重庆话', sentence: '维基百科，自由的百科全书',
    audioUrl: '/audio/dialect/chongqing.opus', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh,_cmn,_cyuc,_Chongqing_dialect,_维基百科,_自由的百科全书.opus', license: 'CC BY-SA 4.0',
  },
  {
    province: '贵州', provinceLabel: '贵州省', city: '贵阳', dialect: '贵阳话', sentence: '维基百科，自由的百科全书',
    audioUrl: '/audio/dialect/guizhou.oga', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh,_cmn,_xghu,_Guiyang_Dialect,_维基百科,_自由的百科全书.oga', license: 'CC BY-SA 4.0',
  },
  {
    province: '浙江', provinceLabel: '浙江省', city: '杭州', dialect: '杭州话', sentence: '方言发音样本',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Zh_dialect_Hangzhou_sample.ogg', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh_dialect_Hangzhou_sample.ogg', license: 'Public domain',
  },
  {
    province: '江苏', provinceLabel: '江苏省', city: '南京', dialect: '南京话', sentence: '爬城头',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/89/LL-Q2681098_%28---%29-Zekai_Wu-%E7%88%AC%E5%9F%8E%E5%A4%B4.wav', sourceUrl: 'https://commons.wikimedia.org/wiki/File:LL-Q2681098_(---)-Zekai_Wu-爬城头.wav', license: 'CC BY-SA 4.0',
  },
  {
    province: '广东', provinceLabel: '广东省', city: '广州', dialect: '广州话（粤语）', sentence: '方言发音样本',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Zh-dialect_Guangzhou_sample.ogg', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Zh-dialect_Guangzhou_sample.ogg', license: 'CC BY-SA 2.5',
  },
  {
    province: '福建', provinceLabel: '福建省', city: '福州', dialect: '福州话', sentence: '鸡母扒粪扫，无事讨事做',
    audioUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Cdo-fzho_%E5%99%87%E9%A3%BD%E6%81%B0%E9%96%92.wav', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Cdo-fzho_噇飽恰閒.wav', license: 'CC BY 4.0',
  },
];

// 题库保留同一批有明确来源的录音作为练习池，开局会随机抽取档位所需题数。
const clues: DialectClue[] = Array.from({ length: 5 }, () => seedClues).flat();
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const provinceAliases: Record<string, string> = {
  北京: '北京', 北京市: '北京', 天津: '天津', 天津市: '天津', 河北: '河北', 河北省: '河北',
  山东: '山东', 山东省: '山东', 重庆: '重庆', 重庆市: '重庆', 贵州: '贵州', 贵州省: '贵州',
  浙江: '浙江', 浙江省: '浙江', 江苏: '江苏', 江苏省: '江苏', 广东: '广东', 广东省: '广东',
  福建: '福建', 福建省: '福建',
};

function normalizeProvince(value: string) {
  const compact = value.trim().replace(/[\s，。！？、]/g, '');
  const normalized = provinceAliases[compact] ?? compact.replace(/(?:壮族自治区|回族自治区|维吾尔自治区|特别行政区|自治区|省|市)$/g, '');
  return normalized.length >= 2 ? normalized : '';
}

export default function Home() {
  const [phase, setPhase] = useState<'intro' | 'playing'>('intro');
  const [mode, setMode] = useState<10 | 20>(10);
  const [round, setRound] = useState<DialectClue[]>(() => clues.slice(0, 10));
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const clue = round[index] ?? round[0];
  const correct = answer !== null && normalizeProvince(answer) === clue.province;
  const finished = answer !== null && index === round.length - 1;

  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: unknown, options?: unknown) => unknown } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'read_current_dialect_question',
      title: '读取当前方言题',
      description: '读取当前题号、音频说明和是否已经作答。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ question: index + 1, total: round.length, cityHint: '答题时不显示城市', answered: answer !== null }),
    }, { signal: lifecycle.signal })).catch(() => undefined);
    void Promise.resolve(context.registerTool({
      name: 'submit_dialect_province',
      title: '提交方言省份',
      description: '提交自己判断的省份，显示对错和音频来源。',
      inputSchema: { type: 'object', properties: { province: { type: 'string' } }, required: ['province'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (value: unknown) => {
        const province = typeof (value as { province?: unknown })?.province === 'string' ? (value as { province: string }).province : '';
        if (answer !== null) throw new Error('当前题已经作答。');
        if (!normalizeProvince(province)) throw new Error('请输入有效的省份名称。');
        const isCorrect = normalizeProvince(province) === clue.province;
        setInput(province);
        setAnswer(province);
        if (isCorrect) setScore((current) => current + 1);
        return { province, correct: isCorrect, answer: clue.provinceLabel };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [answer, clue.province, index, round.length]);

  function submit() {
    const value = input.trim();
    if (answer || !normalizeProvince(value)) return;
    setAnswer(value);
    if (normalizeProvince(value) === clue.province) setScore((current) => current + 1);
  }

  function next() {
    setIndex((current) => current + 1);
    setInput('');
    setAnswer(null);
    setAudioError(false);
  }

  function restart() {
    setPhase('intro');
    setIndex(0);
    setInput('');
    setAnswer(null);
    setScore(0);
    setAudioError(false);
  }

  function startGame() {
    setRound(shuffle(clues).slice(0, mode));
    setPhase('playing');
    setIndex(0);
    setInput('');
    setAnswer(null);
    setScore(0);
    setAudioError(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#071632] px-5 py-7 text-white sm:px-8">
      <div aria-hidden="true" className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-10%,#1d3967_0%,transparent_42%),radial-gradient(circle_at_0%_100%,#10264c_0%,transparent_40%)]" />
      <div className="relative mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-[#d54545] text-[#ffe185]"><Zap className="size-5" /></span>
            <span><b className="block text-lg">方言捕手</b><small className="text-[10px] tracking-[.16em] text-[#a7b8db]">DIALECT CATCHER</small></span>
          </a>
          {phase === 'playing' && <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-bold">{index + 1} / {round.length}</span>}
        </header>

        {phase === 'intro' && <section className="py-10 text-center sm:py-14">
          <p className="inline-flex items-center gap-2 rounded-full bg-[#193563] px-3 py-1.5 text-xs font-black text-[#ffe185]"><Sparkles className="size-3.5" />自己写答案</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">听声音，猜这是哪个省？</h1>
          <p className="mt-3 text-sm font-semibold text-[#b8c6df]">50 条有来源录音，凭耳朵写下你的判断。</p>
          <div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">{([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#ffe185] bg-[#253f68]' : 'border-white/15 bg-white/5 hover:bg-white/10'}`}><p className="font-black text-white">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#b8c6df]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}</div>
          <Button type="button" onClick={startGame} className="mx-auto mt-7 h-12 rounded-2xl bg-[#d54545] px-6 font-black text-white hover:bg-[#bd3535]">开始挑战 <ArrowRight className="size-4" /></Button>
        </section>}

        {phase === 'playing' && <>
        <section className="rounded-[2rem] border border-white/10 bg-[#10264c] p-4 shadow-[0_24px_70px_rgba(0,0,0,.28)] sm:p-5">
          <div className="rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_center,#193563_0%,#0d1d3c_55%,#071632_100%)] p-6 sm:p-8">
            <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#d54545] text-[#ffe185]"><Volume2 className="size-6" /></span><div><p className="text-xs font-black tracking-[.14em] text-[#ffe185]">第 {index + 1} 段声音</p><h2 className="mt-1 text-xl font-black">这句口音来自哪里？</h2></div></div>
            <audio key={clue.audioUrl} controls preload="metadata" onError={() => setAudioError(true)} className="mt-7 w-full accent-[#d54545]" src={clue.audioUrl} />
            {audioError && <p className="mt-3 text-sm font-semibold text-[#ffb8a8]">这段音频暂时没加载出来，可以刷新后再试。</p>}
            <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#a7b8db]"><CircleHelp className="size-3.5" />按录音标注的省级地区判定，方言本身可能跨越边界。</p>
          </div>
        </section>

        {!answer && (
          <section className="mt-6">
            <form onSubmit={(event) => { event.preventDefault(); submit(); }} className="rounded-[2rem] border border-white/10 bg-[#10264c] p-5 sm:p-6">
              <label htmlFor="province-answer" className="flex items-center gap-2 text-sm font-black text-[#dbe7ff]"><MapPin className="size-4 text-[#ffe185]" />写下你猜的省份</label>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row"><Input id="province-answer" value={input} onChange={(event) => setInput(event.target.value)} disabled={answer !== null} placeholder="例如：四川" className="h-12 rounded-2xl border-white/15 bg-white/10 px-4 text-white placeholder:text-[#91a4c6]" /><Button type="submit" disabled={answer !== null || !normalizeProvince(input)} className="h-12 rounded-2xl bg-[#d54545] px-5 font-black text-white hover:bg-[#bd3535]">提交判断 <ArrowRight className="size-4" /></Button></div>
              <p className="mt-3 text-xs font-semibold text-[#a7b8db]">支持填写“省”或“省份”，例如“广东省”也可以。</p>
            </form>
          </section>
        )}
        {answer && <>
          <div className={`mt-5 rounded-3xl p-5 ${correct ? 'bg-[#17423d]' : 'bg-[#3d2947]'}`}><div className="flex items-start gap-3"><span className={`mt-0.5 grid size-7 place-items-center rounded-full ${correct ? 'bg-[#61d5ad] text-[#12362f]' : 'bg-[#d54545] text-white'}`}>{correct ? <Check className="size-4" /> : <X className="size-4" />}</span><div><p className="font-black">{correct ? '猜中了！' : `这次不是${answer}。`}</p><p className="mt-2 text-sm leading-6 text-[#dbe7ff]">答案是 <b className="text-[#ffe185]">{clue.provinceLabel}</b> · {clue.city} · {clue.dialect}</p><p className="mt-1 text-sm leading-6 text-[#b8c6df]">原句：{clue.sentence}</p><p className="mt-1 text-xs text-[#93a7ca]">授权：{clue.license}</p><a href={clue.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#ffe185] hover:underline">查看音频来源与授权 <ExternalLink className="size-3.5" /></a></div></div>{!finished && <Button type="button" onClick={next} className="mt-5 h-10 rounded-2xl bg-[#d54545] font-black text-white hover:bg-[#bd3535]">下一题 <ArrowRight className="size-4" /></Button>}</div>
          {finished && <section className="mt-5 rounded-[2rem] border border-white/10 bg-[#163765] p-7 text-center sm:p-9"><p className="text-sm font-black tracking-[.14em] text-[#ffe185]">你的成绩</p><p className="mt-3 text-6xl font-black">{score}<span className="text-2xl text-[#b8c6df]"> / {round.length}</span></p><h2 className="mt-6 text-2xl font-black">{score === round.length ? '你已经开始听见省份了。' : score / round.length >= 0.7 ? '这耳朵，跑过不少地方。' : score / round.length >= 0.4 ? '省份线索抓到了几条。' : '先别急，方言比想象中更会伪装。'}</h2><Button type="button" onClick={restart} className="mt-7 h-11 rounded-2xl bg-[#d54545] px-5 font-black text-white hover:bg-[#bd3535]"><RotateCcw className="size-4" />再猜一次</Button></section>}
        </>}
        </>}
        <Community quizName="方言捕手" tone="sky" />
      </div>
    </main>
  );
}
