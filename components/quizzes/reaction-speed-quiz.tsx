'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  MousePointer2,
  RotateCcw,
  Send,
  Timer,
  Trophy,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

import { Community } from '@/components/community';
import { QuizResultActions } from '@/components/quiz-result-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TOTAL_ROUNDS = 5;
const MIN_DELAY = 900;
const MAX_DELAY = 2_800;

type Phase = 'intro' | 'waiting' | 'ready' | 'early' | 'result';
type GameMode = 'basic' | 'advanced';
type LeaderboardEntry = {
  id: number;
  nickname: string;
  scoreMs: number;
  createdAt: string;
};
type TargetPosition = { x: number; y: number };

const GAME_MODES: GameMode[] = ['basic', 'advanced'];
const MODE_LABELS: Record<GameMode, { title: string; description: string }> = {
  basic: { title: '基础版', description: '小圆按钮，变黄就按，先熟悉节奏。' },
  advanced: {
    title: '进阶版',
    description: '按钮随机出现，看到就按，考验眼手同步。',
  },
};
const CENTER_POSITION: TargetPosition = { x: 50, y: 50 };

function randomTargetPosition(): TargetPosition {
  return { x: 25 + Math.random() * 50, y: 25 + Math.random() * 50 };
}

function totalOf(times: number[]) {
  return times.reduce((sum, value) => sum + value, 0);
}

function formatScore(value: number) {
  return `${value.toLocaleString('zh-CN')} ms`;
}

export default function ReactionSpeedQuiz() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [mode, setMode] = useState<GameMode>('basic');
  const [round, setRound] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [nickname, setNickname] = useState('');
  const [targetPosition, setTargetPosition] =
    useState<TargetPosition>(CENTER_POSITION);
  const [leaderboard, setLeaderboard] = useState<
    Record<GameMode, LeaderboardEntry[]>
  >({ basic: [], advanced: [] });
  const [leaderboardAvailable, setLeaderboardAvailable] = useState<
    Record<GameMode, boolean>
  >({ basic: true, advanced: true });
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [submitState, setSubmitState] = useState<
    'idle' | 'submitting' | 'saved' | 'error'
  >('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const timerRef = useRef<number | null>(null);
  const readyAtRef = useRef<number | null>(null);
  const total = useMemo(() => totalOf(times), [times]);

  const loadLeaderboard = useCallback(async () => {
    setLeaderboardLoading(true);
    const results = await Promise.allSettled(
      GAME_MODES.map(async (currentMode) => {
        const response = await fetch(
          `/api/reaction-leaderboard?mode=${currentMode}`,
          { cache: 'no-store' },
        );
        if (!response.ok) throw new Error('load failed');
        const data = (await response.json()) as {
          available?: boolean;
          entries?: LeaderboardEntry[];
        };
        return {
          mode: currentMode,
          available: data.available !== false,
          entries: data.entries ?? [],
        };
      }),
    );
    const nextLeaderboard: Record<GameMode, LeaderboardEntry[]> = {
      basic: [],
      advanced: [],
    };
    const nextAvailable: Record<GameMode, boolean> = {
      basic: false,
      advanced: false,
    };
    results.forEach((result, index) => {
      const currentMode = GAME_MODES[index];
      if (result.status === 'fulfilled') {
        nextLeaderboard[currentMode] = result.value.entries;
        nextAvailable[currentMode] = result.value.available;
      }
    });
    setLeaderboard(nextLeaderboard);
    setLeaderboardAvailable(nextAvailable);
    setLeaderboardLoading(false);
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadLeaderboard();
    }, 0);
    return () => {
      window.clearTimeout(initialLoad);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [loadLeaderboard]);

  useEffect(() => {
    if (phase !== 'waiting') return;
    const delay =
      MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
    timerRef.current = window.setTimeout(() => {
      readyAtRef.current = performance.now();
      setPhase('ready');
    }, delay);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [phase]);

  function startGame() {
    setRound(0);
    setTimes([]);
    setSubmitState('idle');
    setSubmitMessage('');
    readyAtRef.current = null;
    setTargetPosition(
      mode === 'advanced' ? randomTargetPosition() : CENTER_POSITION,
    );
    setPhase('waiting');
  }

  function chooseModeAgain() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    readyAtRef.current = null;
    setRound(0);
    setTimes([]);
    setNickname('');
    setSubmitState('idle');
    setSubmitMessage('');
    setTargetPosition(CENTER_POSITION);
    setPhase('intro');
  }

  function clickTarget() {
    if (phase === 'waiting') {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      readyAtRef.current = null;
      setPhase('early');
      return;
    }
    if (phase !== 'ready' || readyAtRef.current === null) return;

    const reaction = Math.max(
      1,
      Math.round(performance.now() - readyAtRef.current),
    );
    const nextTimes = [...times, reaction];
    readyAtRef.current = null;
    setTimes(nextTimes);
    if (nextTimes.length === TOTAL_ROUNDS) {
      setPhase('result');
    } else {
      setRound(nextTimes.length);
      setTargetPosition(
        mode === 'advanced' ? randomTargetPosition() : CENTER_POSITION,
      );
      setPhase('waiting');
    }
  }

  function activateTarget(event: { preventDefault: () => void }) {
    event.preventDefault();
    clickTarget();
  }

  function activateTargetFromKeyboard(event: {
    key: string;
    preventDefault: () => void;
  }) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      clickTarget();
    }
  }

  async function submitScore() {
    const cleanName = nickname.trim();
    if (!cleanName || submitState === 'submitting') return;
    setSubmitState('submitting');
    setSubmitMessage('');
    try {
      const response = await fetch('/api/reaction-leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname: cleanName, scoreMs: total, mode }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? '提交失败');
      setSubmitState('saved');
      setSubmitMessage('已上榜，去看看你排第几。');
      await loadLeaderboard();
    } catch (error) {
      setSubmitState('error');
      setSubmitMessage(
        error instanceof Error ? error.message : '提交失败，请稍后再试。',
      );
    }
  }

  const targetLabel =
    phase === 'ready'
      ? mode === 'advanced'
        ? '出现了！快按'
        : '现在！快按'
      : phase === 'waiting'
        ? '稳住，别抢跑'
        : '按这里开始';
  const targetClass =
    phase === 'ready'
      ? mode === 'advanced'
        ? 'border-[#a4d2c0] bg-[#5c9b83] text-white shadow-[0_0_0_7px_rgba(92,155,131,.16),0_10px_0_#37745f] hover:bg-[#4f8d75]'
        : 'border-[#f7d978] bg-[#f4ce67] text-[#252b49] shadow-[0_0_0_7px_rgba(244,206,103,.16),0_10px_0_#c69335] hover:bg-[#f8d982]'
      : phase === 'early'
        ? 'border-[#f09c88] bg-[#d85f48] text-white shadow-[0_0_0_7px_rgba(216,95,72,.13),0_10px_0_#a94435] hover:bg-[#c9533f]'
        : 'border-[#6a7da8] bg-[#394b78] text-white shadow-[0_0_0_7px_rgba(57,75,120,.15),0_10px_0_#29365e] hover:bg-[#465b8e]';

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f2e7] px-5 py-7 text-[#1d2431] sm:px-8">
      <div
        aria-hidden="true"
        className="paper-grain pointer-events-none fixed inset-0"
      />
      <div className="relative mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-[#555d70] hover:text-[#252b49]"
          >
            <ArrowLeft className="size-4" />
            返回测试中心
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2e3552]/15 bg-[#fffaf0]/80 px-3.5 py-2 text-xs font-bold text-[#535b6c] shadow-sm">
            <Timer className="size-3.5 text-[#d85f48]" />5 轮 · 总反应时间
          </span>
        </header>

        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#2b334d]/12 bg-[#fffdf8]/90 shadow-[0_15px_36px_rgba(43,51,77,.09)]">
          <div className="bg-[#252b49] px-6 py-8 text-center text-[#fff8e8] sm:px-10 sm:py-10">
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f4ce67] text-[#252b49] shadow-[4px_4px_0_#d85f48]">
              <Zap className="size-7" />
            </div>
            <p className="mt-5 text-xs font-black tracking-[.18em] text-[#f4ce67]">
              REACTION SPEED
            </p>
            <h1 className="mt-2 font-serif text-4xl font-black tracking-tight sm:text-5xl">
              反应速度局
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-6 text-[#cbd1df]">
              两种玩法，五轮成绩直接相加，数字越小，说明你的手越快。
            </p>
          </div>

          <div className="p-6 sm:p-10">
            {phase === 'intro' && (
              <div className="mx-auto max-w-2xl text-center">
                <div className="grid gap-3 text-left sm:grid-cols-2">
                  {GAME_MODES.map((currentMode) => (
                    <button
                      key={currentMode}
                      type="button"
                      aria-pressed={mode === currentMode}
                      onClick={() => setMode(currentMode)}
                      className={`rounded-2xl border p-4 text-left transition ${mode === currentMode ? 'border-[#2c665c] bg-white/90 shadow-sm' : 'border-black/10 bg-[#f3eee2] hover:bg-white/80'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-black text-[#303752]">
                          {MODE_LABELS[currentMode].title}
                        </p>
                        <span
                          className={`grid size-6 place-items-center rounded-full text-xs font-black ${mode === currentMode ? 'bg-[#d85f48] text-white' : 'bg-[#d8ddd5] text-[#7c837f]'}`}
                        >
                          {currentMode === 'basic' ? 'A' : 'B'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold leading-5 text-[#747a86]">
                        {MODE_LABELS[currentMode].description}
                      </p>
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  onClick={startGame}
                  className="mt-7 h-12 rounded-2xl bg-[#d85f48] px-6 font-black text-white shadow-[4px_4px_0_#f0ad50] hover:bg-[#c9533f]"
                >
                  开始{MODE_LABELS[mode].title} <Zap className="size-4" />
                </Button>
              </div>
            )}

            {(phase === 'waiting' ||
              phase === 'ready' ||
              phase === 'early') && (
              <div className="mx-auto max-w-xl text-center">
                <div className="flex items-center justify-between text-xs font-black text-[#7b808b]">
                  <span>
                    第 {Math.min(round + 1, TOTAL_ROUNDS)} / {TOTAL_ROUNDS} 轮
                  </span>
                  <span>
                    {mode === 'advanced'
                      ? phase === 'ready'
                        ? '按钮出现了'
                        : '留意按钮位置'
                      : phase === 'ready'
                        ? '颜色已变化'
                        : '等待中'}
                  </span>
                </div>
                <div className="relative mt-5 min-h-[20rem] overflow-hidden rounded-[2rem] border border-[#d8d9df] bg-[#f3eee2] sm:min-h-[24rem]">
                  {mode === 'advanced' && phase === 'waiting' ? (
                    <div className="absolute inset-0 grid place-items-center px-8 text-center">
                      <div>
                        <MousePointer2 className="mx-auto size-8 text-[#8c927f]" />
                        <p className="mt-3 text-sm font-black text-[#6f766f]">
                          按钮马上会出现在随机位置
                        </p>
                        <p className="mt-1 text-xs font-semibold text-[#989c91]">
                          出现就按，不用等颜色变化
                        </p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onPointerDown={activateTarget}
                      onKeyDown={activateTargetFromKeyboard}
                      style={{
                        left: `${targetPosition.x}%`,
                        top: `${targetPosition.y}%`,
                      }}
                      className={`absolute flex size-36 -translate-x-1/2 -translate-y-1/2 touch-manipulation select-none flex-col items-center justify-center rounded-full border-2 px-4 text-center transition duration-150 active:translate-y-2 active:shadow-none sm:size-44 ${targetClass}`}
                      aria-live="polite"
                    >
                      <span className="text-xl font-black sm:text-2xl">
                        {phase === 'early' ? '抢跑了！' : targetLabel}
                      </span>
                      <span className="mt-2 text-xs font-bold opacity-80 sm:text-sm">
                        {phase === 'early'
                          ? '重新开始再试一次'
                          : phase === 'ready'
                            ? mode === 'advanced'
                              ? '就是现在'
                              : '看到黄色就按'
                            : '看到变化前不要按'}
                      </span>
                    </button>
                  )}
                </div>
                {phase === 'early' && (
                  <Button
                    type="button"
                    onClick={startGame}
                    className="mt-7 h-11 rounded-2xl bg-[#252b49] px-5 font-black text-white hover:bg-[#373f64]"
                  >
                    <RotateCcw className="size-4" />
                    重新开始
                  </Button>
                )}
              </div>
            )}

            {phase === 'result' && (
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-black tracking-[.16em] text-[#d85f48]">
                  你的五轮总成绩
                </p>
                <p className="mt-2 font-serif text-6xl font-black tracking-tight text-[#252b49]">
                  {formatScore(total)}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#777d88]">
                  测试完成，你还在反应速度局里。
                </p>
                <div className="mt-6 grid grid-cols-5 gap-2">
                  {times.map((value, index) => (
                    <div
                      key={`${value}-${index}`}
                      className="rounded-2xl bg-[#f3eee2] px-2 py-3"
                    >
                      <p className="text-[10px] font-black text-[#99908a]">
                        第 {index + 1} 轮
                      </p>
                      <p className="mt-1 text-sm font-black text-[#3c4663]">
                        {value} ms
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-7 rounded-2xl border border-[#d7d9df] bg-[#fffaf0] p-5 text-left">
                  <p className="flex items-center gap-2 text-sm font-black text-[#303752]">
                    <Trophy className="size-4 text-[#d85f48]" />
                    留下名字，看看能不能进榜
                  </p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={nickname}
                      onChange={(event) =>
                        setNickname(event.target.value.slice(0, 16))
                      }
                      maxLength={16}
                      placeholder="你的名字（不用登录）"
                      className="h-11 rounded-xl border-[#d7d7d2] bg-white"
                    />
                    <Button
                      type="button"
                      onClick={() => void submitScore()}
                      disabled={
                        !nickname.trim() || submitState === 'submitting'
                      }
                      className="h-11 rounded-xl bg-[#252b49] px-5 font-black text-white hover:bg-[#373f64]"
                    >
                      <Send className="size-4" />
                      {submitState === 'submitting' ? '提交中…' : '上榜'}
                    </Button>
                  </div>
                  <p
                    className={`mt-2 text-xs font-semibold ${submitState === 'error' ? 'text-[#b45a44]' : 'text-[#7c818c]'}`}
                    aria-live="polite"
                  >
                    {submitMessage || '只显示你填写的名字和总毫秒数。'}
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={startGame}
                    className="h-11 rounded-2xl bg-[#252b49] px-5 font-black text-white hover:bg-[#373f64]"
                  >
                    <RotateCcw className="size-4" />
                    再测五轮
                  </Button>
                  <Button
                    type="button"
                    onClick={chooseModeAgain}
                    variant="outline"
                    className="h-11 rounded-2xl border-[#d4d5d7] bg-white px-5 font-black text-[#3b4561] hover:bg-[#f3eee2]"
                  >
                    <ArrowLeft className="size-4" />
                    重新选择玩法
                  </Button>
                </div>
                <QuizResultActions testId="reaction-speed" title="反应速度局" score={`${total} ms`} detail={MODE_LABELS[mode].title} href="/reaction-speed" />
              </div>
            )}
          </div>
        </section>

        <section
          className="mt-8 rounded-[2rem] border border-[#2b334d]/12 bg-[#fffdf8]/90 p-6 shadow-[0_12px_28px_rgba(43,51,77,.06)] sm:p-8"
          aria-labelledby="reaction-leaderboard-title"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[.16em] text-[#d85f48]">
                PUBLIC BOARD
              </p>
              <h2
                id="reaction-leaderboard-title"
                className="mt-2 font-serif text-2xl font-black tracking-tight text-[#252b49]"
              >
                反应速度排行榜
              </h2>
              <p className="mt-1 text-sm font-semibold text-[#777d88]">
                基础版和进阶版分开排名，五轮总时间越低越快。
              </p>
            </div>
            <Trophy className="size-7 text-[#d85f48]" />
          </div>
          {leaderboardLoading ? (
            <p className="mt-5 text-sm font-semibold text-[#858a95]">
              排行榜正在醒来…
            </p>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {GAME_MODES.map((boardMode) => (
                <div
                  key={boardMode}
                  className="rounded-2xl border border-[#e0e0df] bg-[#fffaf0]/70 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-serif text-lg font-black text-[#303752]">
                      {MODE_LABELS[boardMode].title}排行榜
                    </h3>
                    <span className="rounded-full bg-[#f3eee2] px-2.5 py-1 text-[10px] font-black text-[#7a7f87]">
                      {boardMode === 'basic' ? '变黄后按' : '出现就按'}
                    </span>
                  </div>
                  {!leaderboardAvailable[boardMode] ? (
                    <p className="mt-4 rounded-xl border border-dashed border-[#c9cbd0] px-3 py-4 text-xs font-semibold text-[#858a95]">
                      排行榜暂时休息，测试仍然可以玩。
                    </p>
                  ) : leaderboard[boardMode].length === 0 ? (
                    <p className="mt-4 rounded-xl border border-dashed border-[#c9cbd0] px-3 py-4 text-xs font-semibold text-[#858a95]">
                      还没有成绩，来当第一名。
                    </p>
                  ) : (
                    <ol className="mt-4 grid gap-2">
                      {leaderboard[boardMode].map((entry, index) => (
                        <li
                          key={entry.id}
                          className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${index < 3 ? 'bg-[#fff0bd]' : 'bg-[#f3eee2]'}`}
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#252b49] text-[10px] font-black text-[#fff8e8]">
                              {index + 1}
                            </span>
                            <span className="truncate text-xs font-black text-[#303752]">
                              {entry.nickname}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-black text-[#d85f48]">
                            {formatScore(entry.scoreMs)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <Community quizName="反应速度局" tone="sky" />
      </div>
    </main>
  );
}
