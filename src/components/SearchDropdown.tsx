"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

export default function SearchDropdown({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const q = query.trim();
    if (q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetch(`/api/tmdb/search/movie?query=${encodeURIComponent(q)}&page=1`),
          fetch(`/api/tmdb/search/tv?query=${encodeURIComponent(q)}&page=1`),
        ]);
        const movieData = movieRes.ok ? await movieRes.json() : { results: [] };
        const tvData = tvRes.ok ? await tvRes.json() : { results: [] };

        const movieResults: SearchResult[] = (movieData.results || []).slice(0, 4).map((m: any) => ({
          id: m.id, title: m.title, year: m.release_date?.split("-")[0] || "", poster_path: m.poster_path, media_type: "movie" as const,
        }));
        const tvResults: SearchResult[] = (tvData.results || []).slice(0, 4).map((t: any) => ({
          id: t.id, title: t.name, year: t.first_air_date?.split("-")[0] || "", poster_path: t.poster_path, media_type: "tv" as const,
        }));

        const merged = [...movieResults, ...tvResults].sort(() => Math.random() - 0.5).slice(0, 8);
        setResults(merged);
        setSelectedIdx(-1);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx((i) => Math.max(i - 1, -1)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIdx >= 0 && results[selectedIdx]) {
        const r = results[selectedIdx];
        router.push(r.media_type === "tv" ? `/tv/${r.id}` : `/movie/${r.id}`);
        onClose();
      } else if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        onClose();
      }
    } else if (e.key === "Escape") { onClose(); }
  }

  return (
    <div className="relative" onKeyDown={handleKeyDown}>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies & TV shows..."
        className="w-56 md:w-80 bg-zinc-900 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/50 transition"
      />
      {(results.length > 0 || (loading && query.trim().length >= 2)) && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-black/50 z-50">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            results.map((r, i) => (
              <Link
                key={`${r.media_type}-${r.id}`}
                href={r.media_type === "tv" ? `/tv/${r.id}` : `/movie/${r.id}`}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 transition ${i === selectedIdx ? "bg-red-600/20 text-white" : "text-zinc-300 hover:bg-white/5"}`}
              >
                <div className="w-9 h-13.5 shrink-0 rounded overflow-hidden bg-zinc-800">
                  {r.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w92${r.poster_path}`} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">N/A</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <span className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 ${r.media_type === "tv" ? "bg-purple-600/40 text-purple-300" : "bg-blue-600/40 text-blue-300"}`}>
                      {r.media_type === "tv" ? "TV" : "MOVIE"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{r.year}</p>
                </div>
              </Link>
            ))
          )}
          {!loading && query.trim().length >= 2 && (
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="block text-center text-xs text-zinc-500 hover:text-white py-2.5 border-t border-zinc-800 transition"
            >
              View all results &rarr;
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
