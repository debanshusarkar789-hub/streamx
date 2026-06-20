"use client";

import { useState, useEffect } from "react";
import { isFavorite, addFavorite, removeFavorite, FavoriteItem } from "@/lib/favorites";

interface Props {
  item: FavoriteItem;
}

export default function FavoriteButton({ item }: Props) {
  const [fav, setFav] = useState(false);

  useEffect(() => {
    setFav(isFavorite(item.id, item.media_type));
  }, [item.id, item.media_type]);

  const toggle = () => {
    if (fav) {
      removeFavorite(item.id, item.media_type);
      setFav(false);
    } else {
      addFavorite(item);
      setFav(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold border transition-all duration-200 ${
        fav
          ? "bg-red-600/20 border-red-500/40 text-red-400 hover:bg-red-600/30"
          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
      }`}
      title={fav ? "Remove from Favorites" : "Add to Favorites"}
    >
      <svg className="w-4 h-4" fill={fav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      {fav ? "Saved" : "Save"}
    </button>
  );
}
