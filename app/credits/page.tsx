export const metadata = {
  title: '素材与署名｜不太正经测试中心',
};

export default function CreditsPage() {
  return (
    <main className="min-h-screen bg-[#fffaf0] px-5 py-10 text-[#2c3148] sm:px-8">
      <article className="mx-auto max-w-3xl rounded-[2rem] border border-[#2b334d]/10 bg-white p-7 shadow-sm sm:p-10">
        <a href="/" className="text-sm font-bold text-[#d85f48] hover:underline">← 回到测试中心</a>
        <p className="mt-8 text-xs font-black tracking-[0.16em] text-[#d85f48]">CREDITS</p>
        <h1 className="mt-2 font-serif text-4xl font-black tracking-tight">素材与署名</h1>
        <p className="mt-5 leading-7 text-[#626978]">自然类题目会优先使用可再利用的素材。每个迁入文件都会保留原始来源和授权信息；尚未迁入的素材不会在这里假装成本地文件。</p>
        <section className="mt-9 rounded-2xl bg-[#f5f0e3] p-5">
          <h2 className="font-black">目前已保存的方言样音</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#626978]">
            <li>北京样音：CC BY-SA 3.0 · Wikimedia Commons</li>
            <li>天津、邯郸样音：CC0 · Wikimedia Commons</li>
            <li>济南、重庆、贵阳样音：CC BY-SA 4.0 · Wikimedia Commons</li>
          </ul>
        </section>
        <p className="mt-7 text-sm leading-6 text-[#626978]">完整的文件路径、来源页与迁入状态见项目内 <code>MATERIALS_AUDIT.md</code>。使用 CC BY / CC BY-SA 素材时，会按其许可证保留署名与链接。</p>
      </article>
    </main>
  );
}
