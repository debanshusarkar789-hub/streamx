"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Episode {
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

interface Season {
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
}

interface Props {
  showId: number;
  seasons: Season[];
  initialSeason?: number;
}

const STILL_BASE = "https://image.tmdb.org/t/p/w342";

export default function TvEpisodeBrowser({ showId, seasons, initialSeason }: Props) {
  const [selectedSeason, setSelectedSeason] = useState(initialSeason || seasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tmdb/tv/${showId}/season/${selectedSeason}`)
      .then((r) => r.ok ? r.json() : { episodes: [] })
      .then((data) => { setEpisodes(data.episodes || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [showId, selectedSeason]);

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Episodes</h2>

      {/* Season Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto scrollbar-none">
        {seasons.map((s) => (
          <button
            key={s.season_number}
            onClick={() => setSelectedSeason(s.season_number)}
            className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition ${
              selectedSeason === s.season_number ? "bg-red-600 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Episodes */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : episodes.length === 0 ? (
        <p className="text-zinc-500 text-center py-8">No episodes found</p>
      ) : (
        <div className="space-y-3">
          {episodes.map((ep, i) => (
            <div key={ep.episode_number} className="flex gap-3 md:gap-4 p-3 rounded-xl transition hover:bg-white/5 group">
              <Link
                href={`/watch/tv/${showId}/${selectedSeason}/${ep.episode_number}`}
                className="flex gap-3 md:gap-4 flex-1 min-w-0"
              >
                <div className="w-28 md:w-40 aspect-video shrink-0 rounded-lg overflow-hidden bg-zinc-800 relative">
                  {ep.still_path ? (
                    <Image src={`${STILL_BASE}${ep.still_path}`} alt={ep.name} fill className="object-cover" sizes="180px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white truncate">
                      {ep.episode_number}. {ep.name}
                    </p>
                    <span className="text-[11px] text-zinc-600 shrink-0">{ep.air_date?.split("-")[0] || ""}</span>
                  </div>
                  {ep.overview && (
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{ep.overview}</p>
                  )}
                  {ep.vote_average > 0 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      <span className="text-[11px] text-yellow-500 font-medium">{ep.vote_average.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </Link>
              <a
                href={`https://vidvault.ru/tv/${showId}/${selectedSeason}/${ep.episode_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 hover:text-emerald-300 transition border border-emerald-500/20"
                title="Download"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
