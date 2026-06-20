import Link from "next/link";
import Image from "next/image";
import { imgUrl } from "@/lib/tmdb";
import type { Movie } from "@/lib/types";

interface Props {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie, index = 0 }: Props) {
  const poster = imgUrl(movie.poster_path);
  const hasPoster = movie.poster_path && poster;

  return (
    <div className="relative group shrink-0 w-[160px] sm:w-[180px] md:w-[200px] scroll-snap-align-start cursor-pointer" style={{ animationDelay: `${index * 50}ms` }}>
      <Link href={`/movie/${movie.id}`} className="block relative overflow-hidden rounded-md transition-all duration-300 group-hover:scale-[1.15] group-hover:z-20 group-hover:shadow-2xl group-hover:shadow-black/80">
        <div className="aspect-[2/3] relative">
          {hasPoster ? (
            <Image src={poster} alt={movie.title} fill sizes="200px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-700 text-xs">N/A</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 bg-black/90 text-[11px] font-bold px-1.5 py-0.5 rounded text-yellow-400 leading-none">{movie.vote_average.toFixed(1)}</div>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <span className="block w-full text-center text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded py-2 transition">More Info</span>
        </div>
      </Link>
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">{movie.title}</h3>
        <p className="text-xs text-zinc-600 mt-0.5">{movie.release_date?.split("-")[0] || "TBA"}</p>
      </div>
    </div>
  );
}
