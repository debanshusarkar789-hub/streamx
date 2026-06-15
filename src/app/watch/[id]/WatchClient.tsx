"use client";

import { useState, useEffect } from "react";
import { addToContinueWatching } from "@/lib/continueWatching";

interface Props {
  movieTitle: string;
  backdropSrc: string;
  posterSrc: string;
  nhdUrl: string;
  vixsrcUrl: string;
  vidfastUrl: string;
  movieId: number;
}

interface Server {
  name: string;
  url: string;
  badge: string;
}

export default function WatchClient({ movieTitle, backdropSrc, posterSrc, nhdUrl, vixsrcUrl, vidfastUrl, movieId }: Props) {
  const [showWarning, setShowWarning] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    addToContinueWatching({
      id: movieId,
      title: movieTitle,
      poster_path: posterSrc.split("/w500").pop() || null,
      backdrop_path: backdropSrc.split("/original").pop() || null,
    });
  }, [movieId, movieTitle, posterSrc, backdropSrc]);

  const servers: Server[] = [
    { name: "NHD", url: nhdUrl, badge: "NHD" },
    { name: "Vixsrc", url: vixsrcUrl, badge: "VX" },
    { name: "VidFast", url: vidfastUrl, badge: "VF" },
  ];

  const current = servers[currentIdx];

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage: `url(${backdropSrc})`,
          filter: "blur(40px) brightness(0.3)",
        }}
      />

      {/* Top Navigation Bar */}
      <div className="relative z-20 flex items-center justify-between px-5 md:px-8 h-16 shrink-0">
        <a
          href={`/movie/${movieId}`}
          className="text-white/70 hover:text-white transition flex items-center gap-2 text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>

        <span className="text-white/80 text-sm font-medium tracking-wide">
          Now Watching: <span className="text-white">{movieTitle}</span>
        </span>

        <div className="flex items-center gap-4 text-white/50">
          <svg className="w-5 h-5 hover:text-white transition cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <svg className="w-5 h-5 hover:text-white transition cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg className="w-5 h-5 hover:text-white transition cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg className="w-5 h-5 hover:text-white transition cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      {/* Warning Banner */}
      {showWarning && (
        <div className="relative z-20 mx-5 md:mx-8 mb-3">
          <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-red-600 text-white text-xs md:text-sm px-4 py-2.5 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span>Please switch to other servers if default server doesn&apos;t work.</span>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-white/80 hover:text-white ml-2 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 md:px-8 pb-6">
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/5">
          {/* Server Select */}
          <div className="flex items-center justify-center gap-2 pt-4 pb-2 px-4 flex-wrap">
            {servers.map((s, i) => (
              <button
                key={s.name}
                onClick={() => { setCurrentIdx(i); setLoaded(false); }}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentIdx === i
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{s.badge}</span>
                {s.name}
              </button>
            ))}
          </div>

          {/* Player Area */}
          <div className="relative aspect-video bg-black/60 mx-4 rounded-lg overflow-hidden">
            <iframe
              key={current.url}
              src={current.url}
              className="w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen"
              onLoad={() => setLoaded(true)}
            />

            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <img
                  src={posterSrc}
                  alt={movieTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-zinc-400 text-sm">Loading from {current.name}...</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-center gap-8 py-4 px-4 border-t border-white/5 mt-3">
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
