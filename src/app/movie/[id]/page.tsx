import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMovie, imgUrl, backdropUrl } from "@/lib/tmdb";
import { getMovieEmbedUrl, getVidVaultMovieUrl } from "@/lib/embed";
import ProviderBadge from "@/components/ProviderBadge";
import FavoriteButton from "@/components/FavoriteButton";
import type { MovieDetails } from "@/lib/types";

export const runtime = "edge";

interface Props {
  params: Promise<{ id: string }>;
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatRuntime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;
  const movie: MovieDetails = await getMovie(Number(id));
  if (!movie) notFound();

  const embedUrl = getMovieEmbedUrl(movie.id);
  const providers = movie["watch/providers"]?.results?.["US"];
  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="bg-black">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={backdropUrl(movie.backdrop_path || movie.poster_path)}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-12 pb-16 md:pb-24">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-end">
            <div className="hidden md:block w-56 lg:w-72 shrink-0 shadow-2xl shadow-black/60 rounded-lg overflow-hidden -mb-32">
              <Image
                src={imgUrl(movie.poster_path)}
                alt={movie.title}
                width={288}
                height={432}
                className="w-full"
              />
            </div>

            <div className="flex-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded">
                  {movie.status === "Released" ? "NOW STREAMING" : movie.status?.toUpperCase()}
                </span>
                {movie.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-yellow-400 font-bold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
                {movie.release_date && <span className="text-zinc-400">{movie.release_date}</span>}
                {movie.runtime > 0 && <span className="text-zinc-400">{formatRuntime(movie.runtime)}</span>}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg tracking-tight leading-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-zinc-400 italic mt-2 text-base md:text-lg">&ldquo;{movie.tagline}&rdquo;</p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres?.map((g) => (
                  <span key={g.id} className="px-3 py-1 bg-white/10 rounded-full text-xs text-zinc-300 border border-white/10">
                    {g.name}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-zinc-300 leading-relaxed max-w-2xl line-clamp-4 text-sm md:text-base">
                {movie.overview}
              </p>

              <div className="flex items-center gap-3 mt-8 flex-wrap">
                <Link
                  href={`/watch/${movie.id}`}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded transition-all duration-200 hover:scale-105 animate-pulse-glow"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </Link>
                <FavoriteButton item={{ id: movie.id, title: movie.title, poster_path: movie.poster_path, media_type: "movie" }} />
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded border border-white/20 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    Trailer
                  </a>
                )}
                <a
                  href={getVidVaultMovieUrl(movie.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded border border-emerald-500/30 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Watch Strip */}
      <section className="px-4 md:px-12 py-8">
        <div className="bg-gradient-to-r from-red-600/10 to-red-800/5 border border-red-900/30 rounded-xl p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Ready to watch {movie.title}?</h2>
              <p className="text-zinc-400 text-sm mt-0.5">Stream instantly in HD &bull; No sign-up required</p>
            </div>
            <Link
              href={`/watch/${movie.id}`}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded transition-all duration-200 hover:scale-105 shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </Link>
          </div>
        </div>
      </section>

      {/* Cast */}
      {movie.credits?.cast && movie.credits.cast.length > 0 && (
        <section className="px-4 md:px-12 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {movie.credits.cast.slice(0, 15).map((person) => (
              <div key={person.id} className="shrink-0 w-24 md:w-28 text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mx-auto ring-2 ring-white/10 group-hover:ring-red-500/50 transition-all">
                  <Image
                    src={imgUrl(person.profile_path, "w185")}
                    alt={person.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs md:text-sm text-zinc-300 mt-2 truncate font-medium">{person.name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trailer */}
      {trailer && (
        <section className="px-4 md:px-12 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Trailer</h2>
          <div className="aspect-video max-w-4xl rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`}
              title={trailer.name}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* Watch Providers */}
      {providers && (
        <section className="px-4 md:px-12 py-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Where to Watch</h2>

          {providers.flatrate && providers.flatrate.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Streaming</h3>
              <div className="flex flex-wrap gap-3">
                {providers.flatrate.map((p) => (
                  <ProviderBadge key={p.provider_id} provider={p} />
                ))}
              </div>
            </div>
          )}

          {providers.rent && providers.rent.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Rent</h3>
              <div className="flex flex-wrap gap-3">
                {providers.rent.map((p) => (
                  <ProviderBadge key={p.provider_id} provider={p} />
                ))}
              </div>
            </div>
          )}

          {providers.buy && providers.buy.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Buy</h3>
              <div className="flex flex-wrap gap-3">
                {providers.buy.map((p) => (
                  <ProviderBadge key={p.provider_id} provider={p} />
                ))}
              </div>
            </div>
          )}

          {!providers.flatrate && !providers.rent && !providers.buy && (
            <p className="text-zinc-500 text-sm">No streaming information available for your region.</p>
          )}
        </section>
      )}

      {/* Details */}
      <section className="px-4 md:px-12 py-6 pb-16">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {movie.budget > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Budget</span>
              <p className="text-white font-semibold mt-1">{formatCurrency(movie.budget)}</p>
            </div>
          )}
          {movie.revenue > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Revenue</span>
              <p className="text-white font-semibold mt-1">{formatCurrency(movie.revenue)}</p>
            </div>
          )}
          {movie.production_countries && movie.production_countries.length > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Production</span>
              <p className="text-white font-semibold mt-1">{movie.production_countries.map((c) => c.name).join(", ")}</p>
            </div>
          )}
          {movie.homepage && (
            <div className="bg-white/5 rounded-lg p-3 col-span-full">
              <span className="text-zinc-500 text-xs uppercase tracking-wider">Website</span>
              <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 font-medium mt-1 block truncate">
                {movie.homepage.replace("https://", "")}
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
