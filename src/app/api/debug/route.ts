import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.TMDB_TOKEN;
  const vercelUrl = process.env.VERCEL_URL;
  const env = process.env.NODE_ENV;

  const results: any = { token_exists: !!token, token_prefix: token?.slice(0, 8), vercel_url: vercelUrl, env };

  if (token) {
    try {
      const res = await fetch("https://api.themoviedb.org/3/trending/movie/week?page=1", {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      results.direct_status = res.status;
      results.direct_ok = res.ok;
      const json = await res.json();
      results.direct_results_count = json.results?.length ?? 0;
      results.direct_total_pages = json.total_pages;
    } catch (e: any) {
      results.direct_error = e.message;
    }
  }

  return NextResponse.json(results);
}
