'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowLeft, ArrowRight, Bird, Bug, Check, Globe2, Headphones, LoaderCircle, RotateCcw, Sparkles, Volume2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Community } from '@/components/community';

type QuizKind = 'insects' | 'foreign' | 'bird-calls';
type Species = { name: string; scientificName: string };
type LanguageQuestion = { country: string; language: string; code: string; phrase: string; hint: string };

const insects: Species[] = [
  ['中华大刀螳', 'Tenodera sinensis'], ['金斑喙凤蝶', 'Teinopalpus aureus'], ['独角仙', 'Trypoxylus dichotomus'], ['大熊猫天牛', 'Acalolepta fraudatrix'], ['竹节虫', 'Ramulus irregulariterdentatus'], ['宽尾凤蝶', 'Papilio maraho'], ['柑橘凤蝶', 'Papilio xuthus'], ['玉带凤蝶', 'Papilio polytes'], ['虎斑蝶', 'Danaus genutia'], ['中华虎凤蝶', 'Luehdorfia chinensis'], ['蓝闪蝶', 'Morpho menelaus'], ['红珠凤蝶', 'Pachliopta aristolochiae'], ['绿尾大蚕蛾', 'Actias selene'], ['乌桕大蚕蛾', 'Samia cynthia'], ['皇蛾', 'Attacus atlas'], ['银杏大蚕蛾', 'Rhodinia jankowskii'], ['豆天蛾', 'Clanis bilineata'], ['透翅蛾', 'Sesia apiformis'], ['黄刺蛾', 'Cnidocampa flavescens'], ['枯叶蛾', 'Gastropacha quercifolia'], ['星天牛', 'Anoplophora chinensis'], ['锈色粒肩天牛', 'Apriona swainsoni'], ['萤火虫', 'Pyrocoelia analis'], ['龙眼鸡', 'Pyrops candelaria'], ['彩虹锹甲', 'Phalacrognathus muelleri'], ['锯锹甲', 'Prosopocoilus inclinatus'], ['金龟子', 'Protaetia brevitarsis'], ['象鼻虫', 'Curculio elephas'], ['七星瓢虫', 'Coccinella septempunctata'], ['二十八星瓢虫', 'Henosepilachna vigintioctopunctata'], ['中华蜜蜂', 'Apis cerana'], ['熊蜂', 'Bombus terrestris'], ['泥蜂', 'Sceliphron madraspatanum'], ['大胡蜂', 'Vespa mandarinia'], ['蚁狮', 'Myrmeleon formicarius'], ['蜻蜓', 'Anax junius'], ['豆娘', 'Calopteryx splendens'], ['中华大刀蜚蠊', 'Mantis religiosa'], ['中华稻蝗', 'Oxya chinensis'], ['蝗虫', 'Locusta migratoria'], ['蟋蟀', 'Gryllus bimaculatus'], ['螽斯', 'Mecopoda niponensis'], ['竹象', 'Cyrtotrachelus buqueti'], ['水黾', 'Gerris lacustris'], ['龙虱', 'Cybister chinensis'], ['田鳖', 'Lethocerus indicus'], ['荔枝蝽', 'Tessaratoma papillosa'], ['角蝉', 'Leptocentrus taurus'], ['叶蝉', 'Cicadella viridis'], ['大蚊', 'Tipula oleracea'],
].map(([name, scientificName]) => ({ name, scientificName }));

const birdCalls: Species[] = [
  ['大山雀', 'Parus major'], ['乌鸫', 'Turdus merula'], ['白头鹎', 'Pycnonotus sinensis'], ['喜鹊', 'Pica pica'], ['红嘴蓝鹊', 'Urocissa erythroryncha'], ['画眉', 'Garrulax canorus'], ['八哥', 'Acridotheres cristatellus'], ['普通翠鸟', 'Alcedo atthis'], ['戴胜', 'Upupa epops'], ['黄鹂', 'Oriolus oriolus'], ['家燕', 'Hirundo rustica'], ['金腰燕', 'Cecropis daurica'], ['白鹡鸰', 'Motacilla alba'], ['珠颈斑鸠', 'Spilopelia chinensis'], ['山斑鸠', 'Streptopelia orientalis'], ['小白鹭', 'Egretta garzetta'], ['苍鹭', 'Ardea cinerea'], ['夜鹭', 'Nycticorax nycticorax'], ['绿头鸭', 'Anas platyrhynchos'], ['灰雁', 'Anser anser'], ['黑水鸡', 'Gallinula chloropus'], ['白骨顶', 'Fulica atra'], ['普通鸬鹚', 'Phalacrocorax carbo'], ['红隼', 'Falco tinnunculus'], ['雀鹰', 'Accipiter nisus'], ['红尾伯劳', 'Lanius cristatus'], ['北红尾鸲', 'Phoenicurus auroreus'], ['灰椋鸟', 'Spodiopsar cineraceus'], ['灰喜鹊', 'Cyanopica cyanus'], ['大嘴乌鸦', 'Corvus macrorhynchos'], ['灰树鹊', 'Dendrocitta formosae'], ['银喉长尾山雀', 'Aegithalos caudatus'], ['暗绿绣眼鸟', 'Zosterops simplex'], ['黄眉柳莺', 'Phylloscopus inornatus'], ['普通朱雀', 'Carpodacus erythrinus'], ['黑尾蜡嘴雀', 'Eophona migratoria'], ['白眉鹀', 'Emberiza tristrami'], ['环颈雉', 'Phasianus colchicus'], ['普通燕鸥', 'Sterna hirundo'], ['楼燕', 'Apus apus'], ['凤头鹰', 'Accipiter trivirgatus'], ['普通鵟', 'Buteo japonicus'], ['红脚隼', 'Falco amurensis'], ['白胸苦恶鸟', 'Amaurornis phoenicurus'], ['普通夜鹰', 'Caprimulgus europaeus'], ['斑嘴鸭', 'Anas poecilorhyncha'], ['赤麻鸭', 'Tadorna ferruginea'], ['大白鹭', 'Ardea alba'], ['鸳鸯', 'Aix galericulata'], ['小䴙䴘', 'Tachybaptus ruficollis'],
].map(([name, scientificName]) => ({ name, scientificName }));

const languages: LanguageQuestion[] = [
  ['冰岛', '冰岛语', 'is-IS', 'Góðan daginn', '北大西洋岛国'], ['芬兰', '芬兰语', 'fi-FI', 'Hyvää päivää', '北欧国家'], ['匈牙利', '匈牙利语', 'hu-HU', 'Jó napot kívánok', '中欧国家'], ['土耳其', '土耳其语', 'tr-TR', 'Merhaba, nasılsın?', '横跨欧亚的国家'], ['希腊', '希腊语', 'el-GR', 'Καλημέρα, τι κάνεις;', '地中海国家'], ['捷克', '捷克语', 'cs-CZ', 'Dobrý den, jak se máte?', '中欧国家'], ['波兰', '波兰语', 'pl-PL', 'Dzień dobry, jak się masz?', '中欧国家'], ['罗马尼亚', '罗马尼亚语', 'ro-RO', 'Bună ziua, ce mai faci?', '东南欧国家'], ['乌克兰', '乌克兰语', 'uk-UA', 'Добрий день, як справи?', '东欧国家'], ['立陶宛', '立陶宛语', 'lt-LT', 'Laba diena, kaip sekasi?', '波罗的海国家'], ['爱沙尼亚', '爱沙尼亚语', 'et-EE', 'Tere päevast, kuidas läheb?', '波罗的海国家'], ['格鲁吉亚', '格鲁吉亚语', 'ka-GE', 'გამარჯობა, როგორ ხარ?', '高加索国家'], ['亚美尼亚', '亚美尼亚语', 'hy-AM', 'Բարև, ինչպե՞ս ես:', '高加索国家'], ['阿尔巴尼亚', '阿尔巴尼亚语', 'sq-AL', 'Përshëndetje, si jeni?', '巴尔干国家'], ['保加利亚', '保加利亚语', 'bg-BG', 'Добър ден, как сте?', '巴尔干国家'], ['斯洛伐克', '斯洛伐克语', 'sk-SK', 'Dobrý deň, ako sa máte?', '中欧国家'], ['斯洛文尼亚', '斯洛文尼亚语', 'sl-SI', 'Dober dan, kako ste?', '中欧国家'], ['克罗地亚', '克罗地亚语', 'hr-HR', 'Dobar dan, kako ste?', '亚得里亚海国家'], ['塞尔维亚', '塞尔维亚语', 'sr-RS', 'Dobar dan, kako ste?', '巴尔干国家'], ['马耳他', '马耳他语', 'mt-MT', 'Bongu, kif int?', '地中海岛国'], ['日本', '日语', 'ja-JP', 'こんにちは、お元気ですか？', '东亚国家'], ['韩国', '韩语', 'ko-KR', '안녕하세요, 잘 지내세요?', '东亚国家'], ['越南', '越南语', 'vi-VN', 'Xin chào, bạn khỏe không?', '东南亚国家'], ['泰国', '泰语', 'th-TH', 'สวัสดี สบายดีไหม', '东南亚国家'], ['印度尼西亚', '印度尼西亚语', 'id-ID', 'Halo, apa kabar?', '东南亚国家'], ['马来西亚', '马来语', 'ms-MY', 'Selamat pagi, apa khabar?', '东南亚国家'], ['菲律宾', '菲律宾语', 'fil-PH', 'Kumusta, kamusta ka?', '东南亚国家'], ['蒙古', '蒙古语', 'mn-MN', 'Сайн байна уу?', '东亚内陆国家'], ['尼泊尔', '尼泊尔语', 'ne-NP', 'नमस्ते, तपाईंलाई कस्तो छ?', '南亚国家'], ['斯里兰卡', '僧伽罗语', 'si-LK', 'ආයුබෝවන්, කොහොමද?', '南亚岛国'], ['肯尼亚', '斯瓦希里语', 'sw-KE', 'Habari, hujambo?', '东非国家'], ['南非', '南非英语', 'en-ZA', 'Howzit, how are you?', '非洲南端国家'], ['巴西', '巴西葡萄牙语', 'pt-BR', 'Olá, tudo bem?', '南美国家'], ['葡萄牙', '葡萄牙语', 'pt-PT', 'Olá, tudo bem contigo?', '欧洲国家'], ['西班牙', '西班牙语', 'es-ES', 'Hola, ¿cómo estás?', '欧洲国家'], ['墨西哥', '墨西哥西班牙语', 'es-MX', 'Hola, ¿qué tal?', '北美国家'], ['法国', '法语', 'fr-FR', 'Bonjour, comment allez-vous?', '西欧国家'], ['意大利', '意大利语', 'it-IT', 'Buongiorno, come stai?', '南欧国家'], ['德国', '德语', 'de-DE', 'Guten Tag, wie geht es dir?', '中欧国家'], ['荷兰', '荷兰语', 'nl-NL', 'Goedendag, hoe gaat het?', '西欧国家'], ['丹麦', '丹麦语', 'da-DK', 'Goddag, hvordan går det?', '北欧国家'], ['瑞典', '瑞典语', 'sv-SE', 'God dag, hur mår du?', '北欧国家'], ['挪威', '挪威语', 'nb-NO', 'God dag, hvordan går det?', '北欧国家'], ['英国', '英语', 'en-GB', 'Hello, how are you today?', '西欧国家'], ['美国', '美国英语', 'en-US', 'Hey, how are you doing?', '北美国家'], ['加拿大', '加拿大英语', 'en-CA', 'Hi there, how is it going?', '北美国家'], ['澳大利亚', '澳大利亚英语', 'en-AU', 'G’day, how are you going?', '大洋洲国家'], ['新西兰', '新西兰英语', 'en-NZ', 'Kia ora, how are you?', '大洋洲国家'], ['以色列', '希伯来语', 'he-IL', 'שלום, מה שלומך?', '西亚国家'], ['伊朗', '波斯语', 'fa-IR', 'سلام، حال شما چطور است؟', '西亚国家'],
].map(([country, language, code, phrase, hint]) => ({ country, language, code, phrase, hint }));

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);
function speciesOptions(answer: Species, bank: Species[]) { return shuffle([answer.name, ...shuffle(bank.filter((item) => item.name !== answer.name)).slice(0, 3).map((item) => item.name)]); }
function languageOptions(answer: LanguageQuestion) { return shuffle([answer.country, ...shuffle(languages.filter((item) => item.country !== answer.country)).slice(0, 3).map((item) => item.country)]); }
function kindFromPath(pathname: string): QuizKind { if (pathname.includes('foreign-country')) return 'foreign'; if (pathname.includes('bird-calls')) return 'bird-calls'; return 'insects'; }

const copy = {
  insects: { title: '昆虫侦探', eyebrow: 'INSECT DETECTIVE', subtitle: '看一眼触角、翅脉和腿，猜出它是谁。', icon: Bug, badge: '50 题库 · 野外昆虫', question: '这是什么昆虫？', loading: '正在翻开一片叶子…', error: '这只虫躲进草丛了', tone: 'forest' as const, community: '昆虫侦探' },
  foreign: { title: '外语猜国家', eyebrow: 'LANGUAGE TRIP', subtitle: '听一小句陌生话，猜它从哪个国家来。', icon: Globe2, badge: '50 题库 · 世界语言', question: '这段声音更像哪个国家？', loading: '正在准备一段声音…', error: '浏览器暂时没有可用的朗读声音', tone: 'sky' as const, community: '外语猜国家' },
  'bird-calls': { title: '鸟鸣识别', eyebrow: 'BIRD CALLS', subtitle: '树叶还没动，你先听出是哪只鸟。', icon: Headphones, badge: '50 题库 · 野鸟叫声', question: '这是谁的叫声？', loading: '正在寻找一段鸟鸣…', error: '这只鸟的录音暂时没找到', tone: 'sky' as const, community: '鸟鸣识别' },
} as const;

function resultFor(kind: QuizKind, score: number, total: number) {
  const ratio = total ? score / total : 0;
  const sets = kind === 'insects' ? [['虫影路人', '你看见了触角，但还没记住它的名字。'], ['草丛观察员', '小小的翅膀和脚，开始有了自己的线索。'], ['昆虫巡游者', '叶片一晃，你已经知道那里藏着什么。'], ['昆虫侦探', '这片草地上的动静，很难再瞒过你。']] : kind === 'foreign' ? [['耳朵游客', '你听见了世界，但地图还要再翻翻。'], ['口音捕手', '几个音节一落地，你已经能猜到大概方向。'], ['语言旅行家', '不用看路牌，你也能靠耳朵走很远。'], ['世界耳朵', '一句问候，就能被你送回正确的国家。']] : [['树下路人', '鸟还在叫，你正在努力把声音和身影对上。'], ['林边听风者', '你开始分辨树梢里那些细小的差别。'], ['鸣声记录员', '一声短鸣，也逃不过你的耳朵。'], ['鸟鸣识别师', '森林还没亮，你已经知道谁在报到。']];
  const index = ratio < .25 ? 0 : ratio < .55 ? 1 : ratio < .82 ? 2 : 3;
  return { title: sets[index][0], copy: sets[index][1] };
}

export default function Home() {
  const pathname = usePathname();
  const kind = useMemo(() => kindFromPath(pathname ?? ''), [pathname]);
  const meta = copy[kind];
  const Icon = meta.icon;
  const pool = kind === 'insects' ? insects : kind === 'bird-calls' ? birdCalls : languages;
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [mode, setMode] = useState<10 | 20>(10);
  const [questions, setQuestions] = useState<Array<(Species | LanguageQuestion) & { options: string[] }>>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [media, setMedia] = useState<string | null>(null);
  const [mediaState, setMediaState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [playing, setPlaying] = useState(false);
  const question = questions[index];
  const completed = index + (answer === null ? 0 : 1);
  const result = useMemo(() => resultFor(kind, score, questions.length), [kind, score, questions.length]);

  useEffect(() => { setPhase('intro'); setQuestions([]); setIndex(0); setScore(0); setAnswer(null); setMedia(null); setMediaState('idle'); }, [kind]);
  useEffect(() => {
    if (phase !== 'playing' || !question || kind === 'foreign') { if (kind === 'foreign') setMediaState('ready'); return; }
    const controller = new AbortController(); setMedia(null); setMediaState('loading');
    const load = async () => {
      if (kind === 'insects') {
        const item = question as Species;
        const params = new URLSearchParams({ taxon_name: item.scientificName, quality_grade: 'research', photo_license: 'cc0,cc-by,cc-by-nc,cc-by-sa,cc-by-nc-sa', photos: 'true', order_by: 'votes', order: 'desc', per_page: '18' });
        const response = await fetch(`https://api.inaturalist.org/v1/observations?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error('image');
        const data = await response.json() as { results?: { photos?: { url?: string }[] }[] };
        const urls: string[] = (data.results ?? []).flatMap((observation) => observation.photos ?? []).map((photo) => photo.url?.replace('square', 'large')).filter((url: string | undefined): url is string => Boolean(url));
        if (!urls.length) throw new Error('image');
        setMedia(shuffle([...new Set<string>(urls)])[0] ?? null);
      } else {
        const item = question as Species;
        setMedia(`/api/bird-call?scientificName=${encodeURIComponent(item.scientificName)}`);
      }
      setMediaState('ready');
    };
    load().catch((error: unknown) => { if (!(error instanceof Error) || error.name !== 'AbortError') setMediaState('error'); });
    return () => controller.abort();
  }, [kind, phase, index, question]);

  function startGame() {
    const selected = kind === 'foreign'
      ? shuffle(languages).slice(0, mode).map((item) => ({ ...item, options: languageOptions(item) }))
      : (() => {
          const speciesPool = kind === 'insects' ? insects : birdCalls;
          return shuffle(speciesPool).slice(0, mode).map((item) => ({ ...item, options: speciesOptions(item, speciesPool) }));
        })();
    setQuestions(selected); setIndex(0); setScore(0); setAnswer(null); setPhase('playing');
  }
  function choose(choice: string) { if (answer !== null) return; const correct = kind === 'foreign' ? (question as LanguageQuestion).country : (question as Species).name; setAnswer(choice); if (choice === correct) setScore((value) => value + 1); }
  function next() { if (index === questions.length - 1) setPhase('result'); else { setIndex((value) => value + 1); setAnswer(null); } }
  function playLanguage() {
    if (kind !== 'foreign' || typeof window === 'undefined' || !question) return;
    const item = question as LanguageQuestion; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(item.phrase); utterance.lang = item.code; utterance.rate = .82; utterance.onstart = () => setPlaying(true); utterance.onend = () => setPlaying(false); utterance.onerror = () => setPlaying(false); window.speechSynthesis.speak(utterance);
  }
  const correctAnswer = question ? kind === 'foreign' ? (question as LanguageQuestion).country : (question as Species).name : '';
  const explanation = question ? kind === 'foreign' ? `${(question as LanguageQuestion).language} · ${(question as LanguageQuestion).hint}` : (question as Species).scientificName : '';

  return <main className={`relative min-h-screen overflow-hidden text-[#1d2a2b] ${kind === 'insects' ? 'bg-[#edf3e9]' : 'bg-[#edf3f4]'}`}><div aria-hidden="true" className="absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_20%_8%,rgba(238,201,111,.38),transparent_40%),radial-gradient(circle_at_90%_16%,rgba(173,206,214,.38),transparent_42%)]" /><div className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-6 sm:px-8 sm:py-8">
    <header className="flex items-center justify-between gap-3"><a href="/" className="flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-2xl text-[#fff7df] shadow-lg ${kind === 'insects' ? 'bg-[#38604e]' : 'bg-[#205564]'}`}><Icon className="size-5" /></span><span><span className="block font-serif text-lg font-black tracking-[0.08em]">{meta.title}</span><span className="block text-[10px] font-bold tracking-[0.15em] text-[#718287]">{meta.eyebrow}</span></span></a><a href="/" className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/65 px-3 py-1.5 text-xs font-bold text-[#526569] hover:bg-white"><ArrowLeft className="size-3.5" />测试中心</a></header>

    {phase === 'intro' && <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-14 text-center sm:py-20"><div className="mb-7 flex justify-center"><span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/75 px-4 py-2 text-sm font-bold text-[#4e6969] shadow-sm"><Sparkles className="size-4 text-[#c1784c]" />{meta.badge}</span></div><h1 className="font-serif text-5xl font-black leading-[1.08] tracking-tight text-[#1d4d52] sm:text-7xl">{kind === 'insects' ? <>你认得出<br /><span className="text-[#bc7045]">这只虫吗？</span></> : kind === 'foreign' ? <>耳朵去旅行<br /><span className="text-[#bc7045]">猜它来自哪里</span></> : <>听见树梢<br /><span className="text-[#bc7045]">猜出是哪只鸟</span></>}</h1><p className="mt-8 font-serif text-xl font-bold text-[#4d676c] sm:text-2xl">{meta.subtitle}</p><div className="mx-auto mt-7 grid w-full max-w-xl grid-cols-2 gap-3 text-left">{([10, 20] as const).map((count) => <button key={count} type="button" onClick={() => setMode(count)} className={`rounded-2xl border p-4 transition ${mode === count ? 'border-[#2c665c] bg-white/85 shadow-sm' : 'border-black/10 bg-white/55 hover:bg-white/80'}`}><p className="font-black text-[#234e51]">{count === 10 ? '入门' : '高手'}</p><p className="mt-1 text-xs font-semibold text-[#708184]">{count} 题 · {count === 10 ? '轻松热身' : '完整挑战'}</p></button>)}</div><Button onClick={startGame} size="lg" className={`mx-auto mt-7 h-12 rounded-2xl px-6 text-base font-bold text-white shadow-lg ${kind === 'insects' ? 'bg-[#38604e] hover:bg-[#2c4e40]' : 'bg-[#205564] hover:bg-[#17434e]'}`}>开始测试 <ArrowRight className="size-4" /></Button><p className="mt-5 text-xs text-[#76878a]">题目按题库随机抽取，答题后会显示答案和小知识。</p></section>}

    {phase === 'playing' && question && <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8 sm:py-12"><div className="mb-7 flex items-center gap-4 sm:mb-9"><div role="progressbar" aria-label="答题进度" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={completed} className="h-1 flex-1 overflow-hidden rounded-full bg-black/10"><div className="h-full rounded-full bg-[#bc7045] transition-[width] duration-500" style={{ width: `${(completed / questions.length) * 100}%` }} /></div><span className="text-xs font-bold text-[#5e7477]">{answer === null ? `${index + 1} / ${questions.length}` : `已完成 ${completed} / ${questions.length}`}</span></div>
      {kind === 'insects' && <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white/80 p-3 shadow-[0_24px_60px_rgba(28,70,75,.1)] sm:p-4"><div className="relative aspect-[16/10] overflow-hidden rounded-[1.45rem] bg-[#30574f]">{mediaState === 'ready' && media ? <img src={media} alt="等待识别的昆虫" className="size-full bg-[#24483f] object-cover" onError={() => setMediaState('error')} /> : <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#77976e_0%,#456c58_45%,#26473d_100%)] text-center text-white">{mediaState === 'error' ? <div><Bug className="mx-auto size-9 opacity-80" /><p className="mt-3 text-sm font-bold">{meta.error}</p><p className="mt-1 text-xs text-white/70">这题仍可继续作答</p></div> : <div><LoaderCircle className="mx-auto size-8 animate-spin text-[#f1d28d]" /><p className="mt-3 text-sm font-bold">{meta.loading}</p></div>}</div>}</div></div>}
      {kind === 'bird-calls' && <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 text-center shadow-[0_24px_60px_rgba(28,70,75,.1)] sm:p-12"><span className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#dceced] text-[#205564]"><Headphones className="size-9" /></span><p className="mt-6 font-serif text-2xl font-black text-[#214f55]">先听一遍，再选答案</p>{mediaState === 'loading' && <p className="mt-3 text-sm font-bold text-[#6c7f82]">{meta.loading}</p>}{mediaState === 'error' && <p className="mt-3 text-sm font-bold text-[#b45b48]">{meta.error}</p>}{media && <audio key={media} controls preload="metadata" className="mx-auto mt-6 w-full max-w-md" src={media} onError={() => setMediaState('error')} />}<p className="mt-3 text-xs font-semibold text-[#718287]">录音由本站从 Xeno-canto 公开物种页同域转发</p>{answer !== null && <a href={`https://xeno-canto.org/species/${(question as Species).scientificName.replaceAll(' ', '-')}`} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-[#205564] underline underline-offset-4">查看当前物种的公开录音页</a>}</div>}
      {kind === 'foreign' && <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 text-center shadow-[0_24px_60px_rgba(28,70,75,.1)] sm:p-12"><span className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#f6e7bd] text-[#a16237]"><Volume2 className="size-9" /></span><p className="mt-6 font-serif text-2xl font-black text-[#214f55]">听一遍这句问候</p><Button onClick={playLanguage} className="mt-6 h-12 rounded-2xl bg-[#205564] px-6 font-bold text-white hover:bg-[#17434e]"><Volume2 className="size-4" />{playing ? '正在播放…' : '播放发音'}</Button><p className="mt-4 text-xs font-semibold text-[#7a8789]">浏览器会用对应语言的声音朗读</p></div>}
      <div className="mt-7 text-center sm:mt-9"><p className="text-sm font-black tracking-[0.16em] text-[#bc7045]">第 {index + 1} / {questions.length} 题</p><h2 className="mt-2 font-serif text-3xl font-black tracking-tight text-[#214f55] sm:text-4xl">{meta.question}</h2></div>{answer === null ? <div className="mx-auto mt-7 grid w-full max-w-2xl grid-cols-1 gap-3 sm:mt-9 sm:grid-cols-2 sm:gap-4">{question.options.map((option, optionIndex) => <Button key={option} onClick={() => choose(option)} variant="outline" className="h-16 justify-start rounded-2xl border-black/10 bg-white/80 px-5 text-left text-base font-black text-[#28545b] hover:border-[#81a9a7] hover:bg-white"><span className="mr-3 grid size-7 place-items-center rounded-full bg-[#e3eee9] text-xs text-[#486d70]">{String.fromCharCode(65 + optionIndex)}</span>{option}</Button>)}</div> : <div className={`mx-auto mt-7 w-full max-w-2xl rounded-3xl border p-5 sm:mt-9 sm:p-6 ${answer === correctAnswer ? 'border-[#b7d8bd] bg-[#eff9ef]' : 'border-[#edc5b4] bg-[#fff3ed]'}`}><div className="flex items-start gap-4"><span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${answer === correctAnswer ? 'bg-[#267365] text-white' : 'bg-[#c0694e] text-white'}`}>{answer === correctAnswer ? <Check className="size-6" /> : <X className="size-6" />}</span><div className="min-w-0 flex-1"><p className={`text-lg font-black ${answer === correctAnswer ? 'text-[#1f6759]' : 'text-[#a84d38]'}`}>{answer === correctAnswer ? '答对了！' : '答错了'}</p><p className="mt-1 text-sm text-[#506a6a]">正确答案：<strong className="text-[#183237]">{correctAnswer}</strong></p>{explanation && <p className="mt-1 text-sm text-[#506a6a]">{explanation}</p>}</div></div><Button onClick={next} className="mt-5 h-11 w-full rounded-2xl bg-[#205564] text-base font-bold text-white hover:bg-[#17434e]">{index === questions.length - 1 ? '查看结果' : `进入第 ${index + 2} 题`} <ArrowRight className="size-4" /></Button></div>}</section>}

    {phase === 'result' && <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12 text-center"><div className="rounded-[2rem] border border-black/10 bg-white/75 p-7 shadow-[0_24px_60px_rgba(28,70,75,.11)] sm:p-10"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#205564] text-[#fff5d8] shadow-lg"><Icon className="size-8" /></span><p className="mt-7 text-sm font-black tracking-[0.16em] text-[#bc7045]">你的成绩</p><p className="mt-2 font-serif text-6xl font-black text-[#214f55]">{score}<span className="text-2xl text-[#597377]"> / {questions.length}</span></p><h1 className="mt-7 font-serif text-3xl font-black leading-tight text-[#214f55] sm:text-4xl">{result.title}</h1><p className="mt-4 text-base text-[#49656a]">{result.copy}</p><Button onClick={startGame} size="lg" className="mt-9 h-12 rounded-2xl bg-[#205564] px-6 text-base font-bold text-white hover:bg-[#17434e]"><RotateCcw className="size-4" /> 再测一次</Button></div><p className="mt-6 text-xs text-[#70858a]">想换一种测试？可以从右上角回到测试中心。</p></section>}
    <Community quizName={meta.community} tone={meta.tone} /><footer className="pt-5 text-center text-xs font-medium text-[#7c9295]">不太正经测试中心 · {meta.title}</footer>
  </div></main>;
}
