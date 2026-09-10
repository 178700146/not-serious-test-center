'use client';

import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Bookmark, Heart, MessageCircle, Reply, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type ReactionSummary = { likes: number; favorites: number; viewerLikes: boolean; viewerFavorites: boolean };
type Comment = ReactionSummary & { id: number; parentId: number | null; nickname: string; content: string; createdAt: string };
type CommunityData = { test: ReactionSummary; comments: Comment[] };
type Tone = 'forest' | 'sky';

const emptyData: CommunityData = { test: { likes: 0, favorites: 0, viewerLikes: false, viewerFavorites: false }, comments: [] };
const tones = {
  forest: { border: 'border-[#d5dfcf]', background: 'bg-[#fbfcf7]/85', accent: 'text-[#1e4a38]', button: 'bg-[#1e4a38] hover:bg-[#163a2b]', soft: 'bg-[#edf5e9]' },
  sky: { border: 'border-[#cdded8]', background: 'bg-[#fbfdf9]/88', accent: 'text-[#1e5360]', button: 'bg-[#1e5360] hover:bg-[#163f49]', soft: 'bg-[#edf6f3]' },
} as const;

function visitorKey(quizName: string) { return `not-serious-test-center:${quizName}:visitor`; }
function readVisitorId(quizName: string) {
  const key = visitorKey(quizName);
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const id = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(key, id);
  return id;
}
function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '刚刚' : date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
}

export function Community({ quizName, tone }: { quizName: string; tone: Tone }) {
  const style = tones[tone];
  const [visitorId, setVisitorId] = useState('');
  const [data, setData] = useState<CommunityData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!visitorId) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/community?quiz=${encodeURIComponent(quizName)}&visitor=${encodeURIComponent(visitorId)}`);
      if (!response.ok) throw new Error('load failed');
      setData(await response.json());
      setError('');
    } catch { setError('讨论区暂时没能加载。'); }
    finally { setLoading(false); }
  }, [quizName, visitorId]);

  useEffect(() => setVisitorId(readVisitorId(quizName)), [quizName]);
  useEffect(() => { void refresh(); }, [refresh]);

  const send = async (payload: Record<string, unknown>) => {
    if (!visitorId) return false;
    setSubmitting(true);
    try {
      const response = await fetch('/api/community', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, quizName, visitorId }) });
      if (!response.ok) throw new Error('save failed');
      await refresh();
      setError('');
      return true;
    } catch { setError('这次操作没有保存成功，请稍后再试。'); return false; }
    finally { setSubmitting(false); }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const saved = await send({ kind: 'comment', nickname: values.get('nickname'), content: values.get('content'), parentId: replyTo?.id ?? null });
    if (saved) { form.reset(); setReplyTo(null); }
  };

  const replies = useMemo(() => new Map(data.comments.filter((comment) => comment.parentId !== null).map((comment) => [comment.parentId!, data.comments.filter((item) => item.parentId === comment.parentId)])), [data.comments]);
  const topLevel = data.comments.filter((comment) => comment.parentId === null);
  const reactionButton = (kind: 'test_reaction' | 'comment_reaction', reaction: 'like' | 'favorite', commentId?: number) => send({ kind, reaction, commentId });
  const renderComment = (comment: Comment, isReply = false) => (
    <article key={comment.id} className={`rounded-2xl border ${style.border} ${isReply ? 'ml-4 mt-3 bg-white/55 p-3.5 sm:ml-8' : 'bg-white/70 p-4'}`}>
      <div className="flex items-start justify-between gap-3"><div><p className={`text-sm font-black ${style.accent}`}>{comment.nickname}</p><p className="mt-0.5 text-[11px] font-semibold text-[#7a8580]">{formatTime(comment.createdAt)}</p></div><button type="button" onClick={() => setReplyTo(comment)} className="inline-flex items-center gap-1 text-xs font-bold text-[#69736f] hover:text-[#1f4d3b]"><Reply className="size-3.5" />回复</button></div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#43534a]">{comment.content}</p>
      <div className="mt-3 flex gap-2"><button type="button" onClick={() => void reactionButton('comment_reaction', 'like', comment.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${comment.viewerLikes ? style.soft : 'bg-[#f3f4ef] text-[#707975]'}`}><Heart className={`size-3.5 ${comment.viewerLikes ? 'fill-current' : ''}`} />{comment.likes}</button><button type="button" onClick={() => void reactionButton('comment_reaction', 'favorite', comment.id)} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${comment.viewerFavorites ? style.soft : 'bg-[#f3f4ef] text-[#707975]'}`}><Bookmark className={`size-3.5 ${comment.viewerFavorites ? 'fill-current' : ''}`} />{comment.favorites}</button></div>
      {(replies.get(comment.id) ?? []).map((reply) => renderComment(reply, true))}
    </article>
  );

  return (
    <section className={`mx-auto mt-10 w-full max-w-3xl rounded-[2rem] border ${style.border} ${style.background} p-5 shadow-[0_16px_36px_rgba(30,57,41,.07)] sm:p-7`} aria-label={`${quizName}讨论区`}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-black tracking-[0.16em] text-[#bf7047]">一起玩的人</p><h2 className={`mt-2 font-serif text-2xl font-black tracking-tight ${style.accent}`}>这套题值得留个言。</h2><p className="mt-2 text-sm font-semibold text-[#6e7974]">匿名说说你答成什么样，或回一回别人的发现。</p></div><div className="flex shrink-0 gap-2"><Button type="button" variant="outline" disabled={submitting} onClick={() => void reactionButton('test_reaction', 'like')} className={`h-10 rounded-2xl border-[#d8dfd5] bg-white/70 px-3 font-bold ${data.test.viewerLikes ? style.accent : 'text-[#66726c]'}`}><Heart className={`size-4 ${data.test.viewerLikes ? 'fill-current' : ''}`} />{data.test.likes}</Button><Button type="button" variant="outline" disabled={submitting} onClick={() => void reactionButton('test_reaction', 'favorite')} className={`h-10 rounded-2xl border-[#d8dfd5] bg-white/70 px-3 font-bold ${data.test.viewerFavorites ? style.accent : 'text-[#66726c]'}`}><Bookmark className={`size-4 ${data.test.viewerFavorites ? 'fill-current' : ''}`} />{data.test.favorites}</Button></div></div>
      <form onSubmit={submitComment} className="mt-6 rounded-2xl border border-[#dbe0d8] bg-white/65 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className={`text-sm font-black ${style.accent}`}>{replyTo ? `回复 ${replyTo.nickname}` : '写一句你的发现'}</p>{replyTo && <button type="button" onClick={() => setReplyTo(null)} className="text-xs font-bold text-[#8a6b5f] hover:underline">取消回复</button>}</div><Input name="nickname" maxLength={20} placeholder="怎么称呼你？（可不填）" className="mt-3 h-10 rounded-xl border-[#d7ded5] bg-[#fffefb]" /><Textarea name="content" required minLength={2} maxLength={500} placeholder={replyTo ? '接着说…' : '例如：第几题把你骗到了？'} className="mt-3 min-h-24 resize-y rounded-xl border-[#d7ded5] bg-[#fffefb]" /><div className="mt-3 flex flex-wrap items-center gap-3"><Button type="submit" disabled={submitting} className={`h-10 rounded-2xl px-4 font-black text-white ${style.button}`}>{submitting ? '正在发送…' : '匿名发言'} <Send className="size-3.5" /></Button><p className="text-xs font-semibold text-[#7b8580]">不显示联系方式，请友好交流。</p></div></form>
      <div className="mt-6"><div className="flex items-center justify-between"><p className={`inline-flex items-center gap-2 text-sm font-black ${style.accent}`}><MessageCircle className="size-4" />讨论 {data.comments.length}</p>{loading && <span className="text-xs font-bold text-[#87918b]">正在更新…</span>}</div>{error && <p className="mt-3 text-sm font-bold text-[#b45a44]">{error}</p>}{!loading && topLevel.length === 0 ? <p className="mt-4 rounded-2xl border border-dashed border-[#cdd7cc] px-4 py-5 text-sm font-semibold text-[#728077]">这里还没有留言。你来写第一句？</p> : <div className="mt-4 grid gap-3">{topLevel.map((comment) => renderComment(comment))}</div>}</div>
    </section>
  );
}
