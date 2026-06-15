export interface ContinueWatchingItem {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  timestamp: number;
}

const STORAGE_KEY = "streamx_continue_watching";

export function getContinueWatching(): ContinueWatchingItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToContinueWatching(item: Omit<ContinueWatchingItem, "timestamp">) {
  try {
    const list = getContinueWatching().filter((m) => m.id !== item.id);
    list.unshift({ ...item, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {}
}
