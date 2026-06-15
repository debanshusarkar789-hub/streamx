import { NextRequest, NextResponse } from "next/server";

const TMDB_BASE = "https://api.themoviedb.org/3";
const cache = new Map<string, { data: string; expiry: number }>();
const CACHE_TTL = 300_000;

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const url = new URL(`${TMDB_BASE}/${slug.join("/")}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
  url.searchParams.set("language", "en-US");

  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return new NextResponse(cached.data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = process.env.TMDB_TOKEN;
  if (!token) return NextResponse.json({ error: "TMDB_TOKEN not set" }, { status: 500 });

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`TMDB responded with ${res.status}`);
    const data = await res.text();
    cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL });
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    // Fallback: try child process (for local dev with TLS issues)
    try {
      const { execFileSync } = await import("child_process");
      const path = await import("path");
      const scriptPath = path.join(process.cwd(), "scripts", "fetch-tmdb.cjs");
      const data = execFileSync(
        process.execPath,
        [scriptPath, url.toString(), token],
        { timeout: 20000, encoding: "utf-8", maxBuffer: 10 * 1024 * 1024, env: { ...process.env, NODE_TLS_REJECT_UNAUTHORIZED: "" } }
      );
      cache.set(cacheKey, { data, expiry: Date.now() + CACHE_TTL });
      return new NextResponse(data, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return NextResponse.json({ error: e.message }, { status: 502 });
    }
  }
}
