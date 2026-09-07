'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Check, Image, LockKeyhole, Save, Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { defaultEditableTests, type EditableTest } from '@/lib/content';

type Status = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

export default function AdminPage() {
  const [cards, setCards] = useState<EditableTest[]>(defaultEditableTests);
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((response) => response.ok ? response.json() as Promise<{ tests?: EditableTest[] }> : Promise.reject(new Error('load failed')))
      .then((data) => {
        if (data.tests?.length) setCards(data.tests);
        setStatus('idle');
      })
      .catch(() => {
        setStatus('error');
        setMessage('内容读取失败，请刷新页面。');
      });
  }, []);

  function updateCard(id: string, field: keyof Omit<EditableTest, 'id'>, value: string) {
    setCards((current) => current.map((card) => card.id === id ? { ...card, [field]: value } : card));
  }

  async function save() {
    if (!pin.trim()) {
      setStatus('error');
      setMessage('先输入管理口令。');
      return;
    }
    setStatus('saving');
    setMessage('');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin.trim() },
        body: JSON.stringify({ tests: cards }),
      });
      const data = await response.json() as { tests?: EditableTest[]; error?: string };
      if (!response.ok) throw new Error(data.error ?? '保存失败');
      if (data.tests) setCards(data.tests);
      setStatus('saved');
      setMessage('已保存，首页刷新后就会显示新内容。');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : '保存失败，请稍后再试。');
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f2e7] px-5 py-7 text-[#1d2431] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-black text-[#555d70] hover:text-[#252b49]"><ArrowLeft className="size-4" />返回测试中心</a>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d5d1c5] bg-[#fffdf8] px-3 py-2 text-xs font-black text-[#6e7380]"><LockKeyhole className="size-3.5 text-[#d85f48]" />站长管理</span>
        </header>

        <section className="mt-10 rounded-[2rem] bg-[#252b49] p-7 text-[#fff8e8] shadow-[0_18px_45px_rgba(37,43,73,.18)] sm:p-9">
          <div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f4ce67] text-[#4b3c21]"><Settings2 className="size-6" /></span><div><p className="text-xs font-black tracking-[.16em] text-[#f4ce67]">CONTROL ROOM</p><h1 className="mt-2 font-serif text-3xl font-black sm:text-4xl">改首页，不用改代码。</h1><p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#cbd1df]">这里可以修改 6 个测试的标题、说明、角标和封面图链接。保存后，测试中心首页会读取最新内容。</p></div></div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="block max-w-sm flex-1 text-sm font-black text-[#fff8e8]">管理口令<Input type="password" value={pin} onChange={(event) => setPin(event.target.value)} placeholder="输入站长口令" className="mt-2 h-11 rounded-xl border-white/15 bg-white/10 text-white placeholder:text-[#9da8c0]" /></label><Button type="button" onClick={save} disabled={status === 'saving' || status === 'loading'} className="h-11 rounded-xl bg-[#d85f48] px-5 font-black text-white hover:bg-[#c5513d]"><Save className="size-4" />{status === 'saving' ? '保存中…' : '保存全部修改'}</Button><p aria-live="polite" className={`text-sm font-bold ${status === 'saved' ? 'text-[#9ae0bd]' : status === 'error' ? 'text-[#ffb8a8]' : 'text-[#cbd1df]'}`}>{message || '口令只用于保存，不会显示在页面上。'}</p></div>
        </section>

        <section className="mt-7 grid gap-5 md:grid-cols-2">
          {cards.map((card) => <article key={card.id} className="rounded-[1.7rem] border border-[#2b334d]/12 bg-[#fffdf8]/90 p-5 shadow-[0_10px_26px_rgba(43,51,77,.06)]"><div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-black tracking-[.14em] text-[#d85f48]">{card.id}</p><h2 className="mt-1 text-lg font-black text-[#252b49]">{card.title}</h2></div><span className="grid size-10 place-items-center rounded-xl bg-[#fff0bd] text-[#b56939]"><Image className="size-5" /></span></div><div className="mt-4 grid gap-3"><label className="text-sm font-black text-[#343952]">角标<Input value={card.eyebrow} onChange={(event) => updateCard(card.id, 'eyebrow', event.target.value)} className="mt-1.5 h-10 rounded-xl border-[#d7d7d2] bg-[#fffdf8]" /></label><label className="text-sm font-black text-[#343952]">标题<Input value={card.title} onChange={(event) => updateCard(card.id, 'title', event.target.value)} className="mt-1.5 h-10 rounded-xl border-[#d7d7d2] bg-[#fffdf8]" /></label><label className="text-sm font-black text-[#343952]">说明<Textarea value={card.description} onChange={(event) => updateCard(card.id, 'description', event.target.value)} className="mt-1.5 min-h-20 resize-y rounded-xl border-[#d7d7d2] bg-[#fffdf8]" /></label><label className="text-sm font-black text-[#343952]">封面图 URL<Input value={card.image} onChange={(event) => updateCard(card.id, 'image', event.target.value)} placeholder="https://..." className="mt-1.5 h-10 rounded-xl border-[#d7d7d2] bg-[#fffdf8]" /></label></div></article>)}
        </section>
        <p className="flex items-center justify-center gap-2 py-8 text-xs font-semibold text-[#858895]"><Check className="size-3.5 text-[#5a9a73]" />建议使用可公开访问的图片链接，封面会按原比例裁切。</p>
      </div>
    </main>
  );
}
