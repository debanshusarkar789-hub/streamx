import MovieCard from "@/components/MovieCard";
import { searchMovies } from "@/lib/tmdb";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page } = await searchParams;

  if (!q) {
    return (
      <div className="pt-24 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto">
          <svg className="w-16 h-16 text-zinc-800 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h1 className="text-3xl font-bold text-white">Search Movies</h1>
          <p className="text-zinc-500 mt-2">Type in the search bar above to find your favorite movies</p>
        </div>
      </div>
    );
  }

  const data = await searchMovies(q, page ? Number(page) : 1);

  return (
    <div className="pt-20 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Results for &ldquo;{q}&rdquo;
        </h1>
        <p className="text-zinc-500 mt-1 text-sm">{data.total_results.toLocaleString()} movies found</p>
      </div>

      {data.results.length === 0 ? (
        <div className="text-center py-20">
          <svg className="w-12 h-12 text-zinc-800 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-zinc-400 text-lg">No movies found</p>
          <p className="text-zinc-600 text-sm mt-1">Try adjusting your search terms</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {data.results.map((m, i) => (
              <MovieCard key={m.id} movie={m} index={i} />
            ))}
          </div>

          {data.total_pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              {(Number(page) || 1) > 1 && (
                <a
                  href={`/search?q=${q}&page=${(Number(page) || 1) - 1}`}
                  className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition font-medium text-sm"
                >
                  &larr; Previous
                </a>
              )}
              <span className="text-zinc-500 text-sm">
                Page {page || 1} of {data.total_pages}
              </span>
              {(Number(page) || 1) < data.total_pages && (
                <a
                  href={`/search?q=${q}&page=${(Number(page) || 1) + 1}`}
                  className="px-5 py-2.5 bg-red-600 rounded-lg text-white hover:bg-red-700 transition font-medium text-sm"
                >
                  Next &rarr;
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
