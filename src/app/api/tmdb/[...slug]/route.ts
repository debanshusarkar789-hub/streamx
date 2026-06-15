import { execFileSync } from "child_process";
import path from "path";
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
  } catch (e: any) {
    const msg = e.stderr?.trim() || e.message;
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
