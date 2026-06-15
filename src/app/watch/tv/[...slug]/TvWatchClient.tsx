"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

interface EpisodeData {
  episodeNumber: number;
  name: string;
  overview: string;
  stillPath: string | null;
  airDate: string;
  voteAverage: number;
}

interface SeasonData {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  posterPath: string | null;
}

interface Props {
  showName: string;
  episodeTitle: string;
  backdropSrc: string;
  posterSrc: string;
  nhdUrl: string;
  vixsrcUrl: string;
  vidfastUrl: string;
  showId: number;
  season: number;
  episode: number;
  seasons: SeasonData[];
  currentSeasonEpisodes: EpisodeData[];
}

interface Server {
  name: string;
  url: string;
  badge: string;
}

const servers: Server[] = [
  { name: "NHD", url: "", badge: "NHD" },
  { name: "Vixsrc", url: "", badge: "VX" },
  { name: "VidFast", url: "", badge: "VF" },
];

const STILL_BASE = "https://image.tmdb.org/t/p/w342";

export default function TvWatchClient({ showName, episodeTitle, backdropSrc, posterSrc, nhdUrl, vixsrcUrl, vidfastUrl, showId, season, episode, seasons, currentSeasonEpisodes }: Props) {
  const [showWarning, setShowWarning] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [episodes, setEpisodes] = useState<EpisodeData[]>(currentSeasonEpisodes);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const serverUrls = [nhdUrl, vixsrcUrl, vidfastUrl];
  const current = servers[currentIdx];
  const currentUrl = serverUrls[currentIdx];

  const switchServer = useCallback((idx: number) => {
    setCurrentIdx(idx);
    setLoaded(false);
  }, []);

  const fetchEpisodes = useCallback(async (seasonNum: number) => {
    setLoadingEpisodes(true);
    try {
      const res = await fetch(`/api/tmdb/tv/${showId}/season/${seasonNum}`);
      if (res.ok) {
        const data = await res.json();
        setEpisodes((data.episodes || []).map((e: any) => ({
          episodeNumber: e.episode_number,
          name: e.name,
          overview: e.overview || "",
          stillPath: e.still_path,
          airDate: e.air_date || "",
          voteAverage: e.vote_average || 0,
        })));
      }
    } catch {}
    setLoadingEpisodes(false);
  }, [showId]);

  const selectSeason = useCallback((seasonNum: number) => {
    setSelectedSeason(seasonNum);
    const existing = seasons.find((s) => s.seasonNumber === seasonNum);
    if (!existing) return;
    if (seasonNum === season) {
      setEpisodes(currentSeasonEpisodes);
    } else {
      fetchEpisodes(seasonNum);
    }
  }, [season, seasons, currentSeasonEpisodes, fetchEpisodes]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black">
      <div className="absolute inset-0 bg-cover bg-center scale-110" style={{ backgroundImage: `url(${backdropSrc})`, filter: "blur(40px) brightness(0.3)" }} />

      {/* Top Nav */}
      <div className="relative z-30 flex items-center justify-between px-4 md:px-8 h-14 shrink-0">
        <Link href={`/tv/${showId}`} className="text-white/70 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <button onClick={() => setPickerOpen(true)} className="text-white/80 hover:text-white text-sm font-medium tracking-wide transition flex items-center gap-2">
          <span>{showName} — <span className="text-white font-semibold">S{season}:E{episode} {episodeTitle}</span></span>
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
        <div className="w-5" />
      </div>

      {/* Warning */}
      {showWarning && (
        <div className="relative z-30 mx-4 md:mx-8 mb-2">
          <div className="flex items-center justify-between bg-gradient-to-r from-red-700 to-red-600 text-white text-xs md:text-sm px-4 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <span>Switch servers if playback doesn&apos;t start.</span>
            </div>
            <button onClick={() => setShowWarning(false)} className="text-white/80 hover:text-white ml-2 shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Player */}
      <div className="relative z-30 flex-1 flex items-center justify-center px-4 md:px-8 pb-2 min-h-0">
        <div className="w-full max-w-5xl bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/5 flex flex-col">
          <div className="flex items-center justify-center gap-2 pt-3 pb-2 px-4 flex-wrap shrink-0">
            {servers.map((s, i) => (
              <button key={s.name} onClick={() => switchServer(i)} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200 ${currentIdx === i ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg" : "bg-white/10 text-zinc-400 hover:bg-white/20 hover:text-white"}`}>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{s.badge}</span>
                {s.name}
              </button>
            ))}
          </div>
          <div className="relative aspect-video bg-black/60 mx-3 rounded-lg overflow-hidden shrink-0">
            <iframe key={currentUrl} src={currentUrl} className="w-full h-full" allowFullScreen allow="autoplay; fullscreen" onLoad={() => setLoaded(true)} />
            {!loaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <img src={posterSrc} alt={showName} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-zinc-400 text-xs">Loading from {current.name}...</span>
                </div>
              </div>
            )}
          </div>
          {/* Episode selector button */}
          <button onClick={() => setPickerOpen(true)} className="flex items-center justify-center gap-2 py-3 px-4 border-t border-white/5 mt-2 text-zinc-400 hover:text-white transition text-sm shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
            Episodes
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">S{season}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-500">{episodes.length} episodes</span>
            <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Episode Picker Modal */}
      {pickerOpen && (
        <div className="fixed inset-0 z-[99999] bg-black/80 flex items-end md:items-center justify-center">
          <div className="bg-zinc-900 w-full max-w-3xl max-h-[85vh] rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
              <h2 className="text-white font-bold text-lg">Episodes</h2>
              <button onClick={() => setPickerOpen(false)} className="text-zinc-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Season Tabs */}
            <div className="flex gap-1 px-5 py-3 overflow-x-auto border-b border-zinc-800 shrink-0 scrollbar-none">
              {seasons.map((s) => (
                <button key={s.seasonNumber} onClick={() => selectSeason(s.seasonNumber)} className={`px-4 py-1.5 text-sm rounded-full whitespace-nowrap transition ${selectedSeason === s.seasonNumber ? "bg-red-600 text-white font-semibold" : "text-zinc-400 hover:text-white hover:bg-white/10"}`}>
                  {s.name}
                </button>
              ))}
            </div>

            {/* Episode Grid */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {loadingEpisodes ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : episodes.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No episodes found</p>
              ) : (
                <div className="space-y-2">
                  {episodes.map((ep) => {
                    const active = ep.episodeNumber === episode && selectedSeason === season;
                    return (
                      <Link
                        key={ep.episodeNumber}
                        href={`/watch/tv/${showId}/${selectedSeason}/${ep.episodeNumber}`}
                        onClick={() => { setPickerOpen(false); setLoaded(false); }}
                        className={`flex gap-3 md:gap-4 p-2.5 rounded-xl transition ${active ? "bg-red-600/15 ring-1 ring-red-500/40" : "hover:bg-white/5"}`}
                      >
                        <div className="w-28 md:w-36 aspect-video shrink-0 rounded-lg overflow-hidden bg-zinc-800">
                          {ep.stillPath ? (
                            <img src={`${STILL_BASE}${ep.stillPath}`} alt={ep.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-700">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium truncate ${active ? "text-red-400" : "text-white"}`}>
                              {ep.episodeNumber}. {ep.name}
                            </p>
                            {ep.airDate && <span className="text-[11px] text-zinc-600 shrink-0">{ep.airDate.split("-")[0]}</span>}
                          </div>
                          {ep.overview && (
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{ep.overview}</p>
                          )}
                          {ep.voteAverage > 0 && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                              <span className="text-[11px] text-yellow-500 font-medium">{ep.voteAverage.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
