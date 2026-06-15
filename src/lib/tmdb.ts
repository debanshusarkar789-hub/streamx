import type { TMDBResponse, Movie, MovieDetails, ProviderResult } from "./types";

const TMDB_IMG = "https://image.tmdb.org/t/p";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_BASE}/api/tmdb${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 300 } });
    if (!res.ok) {
      const body = await res.text();
      if (res.status === 502) throw new Error(body);
      throw new Error(`TMDB error: ${res.status}`);
    }
    return res.json();
  } catch {
    return { results: [], page: 1, total_pages: 0, total_results: 0 } as T;
  }
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
