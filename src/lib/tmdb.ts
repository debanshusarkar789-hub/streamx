import type { TMDBResponse, Movie, MovieDetails, ProviderResult, TvShow, TvDetails, Episode } from "./types";

const TMDB_IMG = "https://image.tmdb.org/t/p";
const TMDB_API = "https://api.themoviedb.org/3";

function getProxyBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const token = process.env.TMDB_TOKEN;

  if (token) {
    try {
      const url = new URL(`${TMDB_API}${endpoint}`);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      url.searchParams.set("language", "en-US");
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        next: { revalidate: 600 },
      });
      if (res.ok) return res.json();
    } catch {}
  }

  try {
    const url = new URL(`${getProxyBase()}/api/tmdb${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { next: { revalidate: 600 } });
    if (res.ok) return res.json();
  } catch {}

  return { results: [], page: 1, total_pages: 0, total_results: 0 } as T;
}

export function imgUrl(path: string | null, size = "w500"): string {
  if (!path) return "/no-poster.svg";
  return `${TMDB_IMG}/${size}${path}`;
}

export function backdropUrl(path: string | null): string {
  return imgUrl(path, "original");
}

export function getTrending(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/trending/movie/week", { page: String(page) });
}

export function getPopular(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/movie/popular", { page: String(page) });
}

export function getNowPlaying(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/movie/now_playing", { page: String(page) });
}

export function getTopRated(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/movie/top_rated", { page: String(page) });
}

export function getUpcoming(page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/movie/upcoming", { page: String(page) });
}

export function getMovie(id: number) {
  return tmdbFetch<MovieDetails>(`/movie/${id}`, {
    append_to_response: "credits,videos,watch/providers",
  });
}

export function searchMovies(query: string, page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/search/movie", { query, page: String(page) });
}

export function getWatchProviders() {
  return tmdbFetch<{ results: ProviderResult[] }>("/watch/providers/movie", { language: "en-US" });
}

export function getMoviesByProvider(providerId: number, page = 1) {
  return tmdbFetch<TMDBResponse<Movie>>("/discover/movie", {
    with_watch_providers: String(providerId),
    watch_region: "US",
    sort_by: "popularity.desc",
    page: String(page),
  });
}

// ---- TV Shows ----

export function getTrendingTv(page = 1) {
  return tmdbFetch<TMDBResponse<TvShow>>("/trending/tv/week", { page: String(page) });
}

export function getPopularTv(page = 1) {
  return tmdbFetch<TMDBResponse<TvShow>>("/tv/popular", { page: String(page) });
}

export function getTopRatedTv(page = 1) {
  return tmdbFetch<TMDBResponse<TvShow>>("/tv/top_rated", { page: String(page) });
}

export function getOnTheAir(page = 1) {
  return tmdbFetch<TMDBResponse<TvShow>>("/tv/on_the_air", { page: String(page) });
}

export function getAiringToday(page = 1) {
  return tmdbFetch<TMDBResponse<TvShow>>("/tv/airing_today", { page: String(page) });
}

export function getTvShow(id: number) {
  return tmdbFetch<TvDetails>(`/tv/${id}`, {
    append_to_response: "credits,videos,watch/providers",
  });
}

export function getTvSeasonEpisodes(tvId: number, seasonNumber: number) {
  return tmdbFetch<{ episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
}

export function searchTv(query: string, page = 1) {
  return tmdbFetch<TMDBResponse<TvShow>>("/search/tv", { query, page: String(page) });
}
