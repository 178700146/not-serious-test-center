export type HistoryEntry = {
  id: string;
  testId: string;
  title: string;
  score: string;
  detail?: string;
  href: string;
  createdAt: string;
};

export type FavoriteEntry = {
  testId: string;
  title: string;
  href: string;
};

const HISTORY_KEY = 'notatest:history:v1';
const FAVORITES_KEY = 'notatest:favorites:v1';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? 'null');
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function readHistory(): HistoryEntry[] {
  const value = readJson<unknown>(HISTORY_KEY, []);
  return Array.isArray(value) ? (value as HistoryEntry[]) : [];
}

export function saveHistory(entry: HistoryEntry) {
  if (typeof window === 'undefined') return;
  const current = readHistory();
  const last = current[0];
  const isDuplicate =
    last?.testId === entry.testId &&
    last.score === entry.score &&
    Date.now() - new Date(last.createdAt).getTime() < 5000;
  if (isDuplicate) return;
  window.localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([entry, ...current].slice(0, 50)),
  );
}

export function clearHistory() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(HISTORY_KEY);
}

export function readFavorites(): FavoriteEntry[] {
  const value = readJson<unknown>(FAVORITES_KEY, []);
  return Array.isArray(value) ? (value as FavoriteEntry[]) : [];
}

export function isFavorite(testId: string) {
  return readFavorites().some((item) => item.testId === testId);
}

export function toggleFavorite(entry: FavoriteEntry) {
  if (typeof window === 'undefined') return false;
  const current = readFavorites();
  const exists = current.some((item) => item.testId === entry.testId);
  const next = exists
    ? current.filter((item) => item.testId !== entry.testId)
    : [entry, ...current].slice(0, 30);
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return !exists;
}
