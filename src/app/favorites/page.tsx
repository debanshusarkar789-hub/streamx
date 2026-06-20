"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFavorites, removeFavorite, FavoriteItem } from "@/lib/favorites";
import { imgUrl } from "@/lib/tmdb";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const filtered = filter === "all" ? favorites : favorites.filter((f) => f.media_type === filter);

  return (
    <div className="min-h-screen bg-black pt-24 pb-28 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Favorites</h1>
        <p className="text-zinc-500 text-sm mb-6">{favorites.length} saved items</p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8">
          {(["all", "movie", "tv"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 text-sm rounded-full transition ${
                filter === t ? "bg-red-600 text-white font-semibold" : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {t === "all" ? "All" : t === "movie" ? "Movies" : "TV Shows"}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-zinc-800 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-zinc-600">No favorites yet</p>
            <Link href="/" className="inline-block mt-4 text-sm text-red-500 hover:text-red-400 transition">
              Browse movies & TV shows
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filtered.map((item) => (
              <div key={`${item.media_type}-${item.id}`} className="group relative">
                <Link href={item.media_type === "tv" ? `/tv/${item.id}` : `/movie/${item.id}`}>
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-zinc-900 relative">
                    {item.poster_path ? (
                      <Image src={imgUrl(item.poster_path, "w342")} alt={item.title} fill className="object-cover" sizes="200px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700 text-xs">N/A</div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.media_type === "tv" ? "bg-purple-600/80 text-purple-200" : "bg-blue-600/80 text-blue-200"}`}>
                        {item.media_type === "tv" ? "TV" : "MOVIE"}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 truncate">{item.title}</p>
                </Link>
                <button
                  onClick={() => {
                    removeFavorite(item.id, item.media_type);
                    setFavorites(getFavorites());
                  }}
                  className="absolute top-1 left-1 w-7 h-7 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                >
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
