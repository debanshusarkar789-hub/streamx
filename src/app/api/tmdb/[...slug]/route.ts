import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

const TMDB_BASE = "https://api.themoviedb.org/3";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const url = new URL(`${TMDB_BASE}/${slug.join("/")}`);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.set(k, v));
  url.searchParams.set("language", "en-US");

  const token = process.env.TMDB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TMDB_TOKEN not set" }, { status: 500 });
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
    const data = await res.text();
    return new NextResponse(data, {
      status: res.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
