"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { imgUrl } from "@/lib/tmdb";
import { getContinueWatching } from "@/lib/continueWatching";

export default function ContinueWatchingRowInner() {
  const [items, setItems] = useState<ReturnType<typeof getContinueWatching>>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  if (!items.length) return null;

  return (
    <section>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-5 tracking-tight">Continue Watching</h2>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin">
        {items.slice(0, 10).map((m) => (
          <Link key={m.id} href={`/watch/${m.id}`} className="shrink-0 w-36 md:w-40 group">
            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 ring-1 ring-white/10 group-hover:ring-red-500/50 transition-all group-hover:scale-105 duration-200 relative">
              {m.poster_path ? (
                <Image src={imgUrl(m.poster_path, "w342")} alt={m.title} fill className="object-cover" sizes="160px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-700 text-sm">No Poster</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mt-1.5 truncate group-hover:text-white transition-colors">{m.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
