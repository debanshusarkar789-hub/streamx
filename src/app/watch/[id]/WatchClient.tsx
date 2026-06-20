"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { addToContinueWatching } from "@/lib/continueWatching";
import { useLandscapeLock } from "@/lib/useLandscapeLock";

interface Props {
  movieTitle: string;
  backdropSrc: string;
  posterSrc: string;
  posterPath: string | null;
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

export default function WatchClient({ movieTitle, backdropSrc, posterSrc, posterPath, nhdUrl, vixsrcUrl, vidfastUrl, movieId }: Props) {
  const [showWarning, setShowWarning] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useLandscapeLock();

  useEffect(() => {
    addToContinueWatching({
      id: movieId,
      title: movieTitle,
      poster_path: posterPath,
      backdrop_path: backdropSrc.split("/original").pop() || null,
    });
  }, [movieId, movieTitle, posterPath, backdropSrc]);

  const servers: Server[] = [
    { name: "Vixsrc", url: vixsrcUrl, badge: "VX" },
    { name: "NHD", url: nhdUrl, badge: "NHD" },
    { name: "VidFast", url: vidfastUrl, badge: "VF" },
  ];

  const current = servers[currentIdx];

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url(${backdropSrc})`, filter: "blur(40px) brightness(0.3)" }} />

      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 h-12 shrink-0">
        <a href={`/movie/${movieId}`} className="text-white/70 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </a>
        <span className="text-white/70 text-xs font-medium truncate mx-2">
          Now Watching: <span className="text-white">{movieTitle}</span>
        </span>
        <div className="w-5" />
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="relative z-20 mx-4 mb-1.5">
          <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-red-600 text-white text-[11px] px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <span>Switch servers if playback doesn&apos;t work.</span>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-white/70 hover:text-white shrink-0">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Player Card */}
      <div className="relative z-20 flex-1 flex items-center justify-center px-4 pb-4 min-h-0">
        <div className="w-full max-w-4xl bg-black/40 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-white/5 flex flex-col">
          {/* Server Select */}
          <div className="flex items-center justify-center gap-1.5 pt-2 pb-1.5 px-3 shrink-0">
            {servers.map((s, i) => (
              <button key={s.name} onClick={() => { setCurrentIdx(i); setLoaded(false); }} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-all duration-200 ${currentIdx === i ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow" : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white"}`}>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{s.badge}</span>
                {s.name}
              </button>
            ))}
          </div>
          {/* Player */}
          <div className="relative aspect-video bg-black/60 mx-3 rounded-lg overflow-hidden max-h-[55vh]">
            <iframe key={current.url} src={current.url} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen" onLoad={() => setLoaded(true)} />
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <Image src={posterSrc} alt={movieTitle} fill className="object-cover opacity-30" />
                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-7 h-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-zinc-400 text-[11px]">Loading from {current.name}...</span>
                </div>
              </div>
            )}
          </div>
          {/* Bottom Bar */}
          <div className="flex items-center justify-center py-2 px-3 shrink-0">
            <a href={`https://vidvault.ru/movie/${movieId}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition text-xs font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
