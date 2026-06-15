import type { TMDBResponse, Movie, MovieDetails, ProviderResult } from "./types";

const TMDB_IMG = "https://image.tmdb.org/t/p";
const TMDB_API = "https://api.themoviedb.org/3";

function getProxyBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const token = process.env.TMDB_TOKEN;

  // Try 1: Direct TMDB API call (works on Vercel, Cloudflare, etc.)
  if (token) {
    try {
      const url = new URL(`${TMDB_API}${endpoint}`);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      url.searchParams.set("language", "en-US");
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) return res.json();
    } catch {}
  }

  // Try 2: API proxy route (works when direct fetch fails)
  try {
    const url = new URL(`${getProxyBase()}/api/tmdb${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString(), { cache: "no-store" });
    if (res.ok) return res.json();
  } catch {}

  // Try 3: Child process fallback (local Windows dev)
  try {
    const { execFileSync } = await import("child_process");
    const path = await import("path");
    const url = new URL(`${TMDB_API}${endpoint}`);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    url.searchParams.set("language", "en-US");
    const scriptPath = path.join(process.cwd(), "scripts", "fetch-tmdb.cjs");
    const data = execFileSync(
      process.execPath,
      [scriptPath, url.toString(), token || ""],
      { timeout: 20000, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024, env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: "" } }
    );
    return JSON.parse(data);
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
