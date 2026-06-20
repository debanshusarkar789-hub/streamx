import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/MovieCard";
import MovieGrid from "@/components/MovieGrid";
import TvCard from "@/components/TvCard";
import TvGrid from "@/components/TvGrid";
import ProviderRow from "@/components/ProviderRow";
import ContinueWatchingRow from "@/components/ContinueWatchingRow";
import { getTrending, getPopular, getNowPlaying, getTopRated, getUpcoming, getWatchProviders, backdropUrl, getTrendingTv, getPopularTv, getOnTheAir, getTopRatedTv } from "@/lib/tmdb";

export const runtime = "edge";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { category } = await searchParams;

  if (category === "popular") {
    const data = await getPopular();
    return (
      <div className="pt-20 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Popular Movies</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {data.results.map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      </div>
    );
  }
  if (category === "top_rated") {
    const data = await getTopRated();
    return (
      <div className="pt-20 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Top Rated</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {data.results.map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      </div>
    );
  }
  if (category === "upcoming") {
    const data = await getUpcoming();
    return (
      <div className="pt-20 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Upcoming</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {data.results.map((m, i) => (
            <MovieCard key={m.id} movie={m} index={i} />
          ))}
        </div>
      </div>
    );
  }
  if (category === "tv") {
    const [trendingTv, popularTv, onTheAir] = await Promise.all([
      getTrendingTv(), getPopularTv(), getOnTheAir(),
    ]);
    return (
      <div className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-white mb-4">TV Shows</h1>
        <TvGrid title="Trending TV" shows={trendingTv.results.slice(0, 18)} />
        <TvGrid title="Popular Series" shows={popularTv.results.slice(0, 18)} />
        <TvGrid title="On The Air" shows={onTheAir.results.slice(0, 18)} />
      </div>
    );
  }

  const [trending, nowPlaying, popular, providersData, trendingTv, popularTv] = await Promise.all([
    getTrending(),
    getNowPlaying(),
    getPopular(),
    getWatchProviders(),
    getTrendingTv(),
    getPopularTv(),
  ]);

  const providers = providersData?.results?.filter((p) => p.display_priority <= 30)?.slice(0, 18) || [];

  const hero = trending.results?.[0];

  return (
    <div className="bg-black">
      {/* Hero Banner */}
      {hero && (
        <section className="relative h-[55vh] min-h-[380px] max-h-[600px]">
          <div className="absolute inset-0 animate-hero">
            <Image
              src={backdropUrl(hero.backdrop_path || hero.poster_path)}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex items-end">
            <div className="w-full px-4 md:px-12 pb-12 md:pb-16">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-3 animate-fade-in">
                  <span className="text-[10px] font-semibold text-white bg-red-600 px-1.5 py-0.5 rounded">
                    TRENDING #1
                  </span>
                  <span className="text-[11px] text-yellow-400 font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {hero.vote_average.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-zinc-400">{hero.release_date?.split("-")[0]}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg tracking-tight animate-fade-in">
                  {hero.title}
                </h1>
                <p className="text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2 mb-5 max-w-lg animate-slide-up">
                  {hero.overview}
                </p>

                <div className="flex items-center gap-3 animate-slide-up">
                  <Link
                    href={`/watch/${hero.id}`}
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-5 md:px-6 py-2 rounded text-sm transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Now
                  </Link>
                  <Link
                    href={`/movie/${hero.id}`}
                    className="inline-flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-semibold px-4 md:px-5 py-2 rounded text-sm backdrop-blur-sm border border-white/10 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    More Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Provider Row */}
      <div className="relative z-10 px-4 md:px-12 pb-2">
        <ProviderRow providers={providers} link="/provider" />
      </div>

      {/* Continue Watching */}
      <div className="relative z-10 px-4 md:px-12 pb-2">
        <ContinueWatchingRow />
      </div>

      {/* Content Rows */}
      <div className="relative z-10 mt-2 pb-8 space-y-6 md:space-y-8">
        <div className="px-4 md:px-12">
          <MovieGrid
            title="Trending Now"
            movies={trending.results.slice(1, 18)}
            link="/?category=popular"
          />
        </div>
        <div className="px-4 md:px-12">
          <MovieGrid
            title="Now Playing"
            movies={nowPlaying.results.slice(0, 18)}
            link="/?category=popular"
          />
        </div>
        <div className="px-4 md:px-12">
          <MovieGrid
            title="Popular on StreamX"
            movies={popular.results.slice(0, 18)}
            link="/?category=popular"
          />
        </div>
        <div className="px-4 md:px-12">
          <TvGrid
            title="Trending TV Shows"
            shows={trendingTv.results.slice(0, 18)}
            link="/?category=tv"
          />
        </div>
        <div className="px-4 md:px-12">
          <TvGrid
            title="Popular Series"
            shows={popularTv.results.slice(0, 18)}
            link="/?category=tv"
          />
        </div>
      </div>
    </div>
  );
}
