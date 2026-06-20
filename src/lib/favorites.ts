"use client";

export interface FavoriteItem {
  id: number;
  title: string;
  poster_path: string | null;
  media_type: "movie" | "tv";
}

const FAV_KEY = "streamx_favorites";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addFavorite(item: FavoriteItem) {
  const favs = getFavorites();
  if (!favs.some((f) => f.id === item.id && f.media_type === item.media_type)) {
    favs.push(item);
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(id: number, media_type: "movie" | "tv") {
  const favs = getFavorites().filter((f) => !(f.id === id && f.media_type === media_type));
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}

export function isFavorite(id: number, media_type: "movie" | "tv"): boolean {
  return getFavorites().some((f) => f.id === id && f.media_type === media_type);
}
