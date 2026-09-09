export type EditableTest = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

export const defaultEditableTests: EditableTest[] = [
  { id: 'mushroom', eyebrow: 'NO. 001 · 50 题库｜10 / 20 题可选', title: '蘑菇大师', description: '只看一眼，猜猜这朵蘑菇有毒吗？', image: 'https://mushroom-master-quiz-01a05b.kind-song-3636.chatgpt.site/og.png' },
  { id: 'bird', eyebrow: 'NO. 002 · 50 题库｜10 / 20 题可选', title: '观鸟大师', description: '看野生鸟照片，从四个选项里选出鸟名。', image: 'https://bird-master-quiz.kind-song-3636.chatgpt.site/og.png' },
  { id: 'bird-calls', eyebrow: 'NO. 003 · 50 题库｜10 / 20 题可选', title: '鸟鸣识别', description: '树叶还没动，你先听出是哪只鸟。', image: '/covers/bird-call-final.png' },
  { id: 'ultraman-face', eyebrow: 'NO. 004 · 50 题库｜10 / 20 题可选', title: '奥特曼认脸局', description: '看形象，叫出这位光之巨人的名字。', image: 'https://ultraman-face-quiz.kind-song-3636.chatgpt.site/og.png' },
  { id: 'ultraman-sound', eyebrow: 'NO. 005 · 50 题库｜10 / 20 题可选', title: '奥特曼听声局', description: '听叫声，从四个名字里选出这位光之巨人。', image: 'https://ultraman-sound-quiz.kind-song-3636.chatgpt.site/og.png' },
  { id: 'pokemon', eyebrow: 'NO. 006 · 50 题库｜10 / 20 题可选', title: '宝可梦剪影局', description: '看轮廓，从四个名字里猜出它是谁。', image: 'https://pokemon-silhouette-quiz.kind-song-3636.chatgpt.site/og.png' },
  { id: 'dialect', eyebrow: 'NO. 007 · 50 题库｜10 / 20 题可选', title: '方言捕手', description: '听一段方言，自己写下你猜的省份。', image: 'https://dialect-catcher.kind-song-3636.chatgpt.site/og-dialect.png' },
  { id: 'foreign-country', eyebrow: 'NO. 008 · 50 题库｜10 / 20 题可选', title: '外语猜国家', description: '听一小句陌生话，猜它从哪个国家来。', image: '/covers/foreign-country-final.png' },
  { id: 'insects', eyebrow: 'NO. 009 · 50 题库｜10 / 20 题可选', title: '昆虫侦探', description: '看一眼触角、翅脉和腿，猜出它是谁。', image: '/covers/insect-final.png' },
];

export function sanitizeEditableTests(value: unknown): EditableTest[] {
  if (!Array.isArray(value)) return defaultEditableTests;
  return defaultEditableTests.map((fallback) => {
    const incoming = value.find((item) => item && typeof item === 'object' && (item as { id?: unknown }).id === fallback.id) as Partial<EditableTest> | undefined;
    if (!incoming) return fallback;
    const clean = (candidate: unknown, defaultValue: string, limit: number) => typeof candidate === 'string' && candidate.trim() ? candidate.trim().slice(0, limit) : defaultValue;
    const incomingImage = clean(incoming.image, fallback.image, 500);
    const legacyCover = ['insects', 'foreign-country', 'bird-calls'].includes(fallback.id)
      ? 'https://strange-skill-quiz.kind-song-3636.chatgpt.site/og.png'
      : null;
    return {
      id: fallback.id,
      eyebrow: clean(incoming.eyebrow, fallback.eyebrow, 80),
      title: clean(incoming.title, fallback.title, 40),
      description: clean(incoming.description, fallback.description, 160),
      image: legacyCover && incomingImage === legacyCover ? fallback.image : incomingImage,
    };
  });
}
