import { notFound } from "next/navigation";
import Link from "next/link";
import MovieCard from "@/components/MovieCard";
import { getMoviesByProvider, getWatchProviders, imgUrl } from "@/lib/tmdb";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; page?: string }>;
}

export default async function ProviderPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { name, page } = await searchParams;
  const providerId = Number(id);
  if (!providerId) notFound();

  const [data, providersData] = await Promise.all([
    getMoviesByProvider(providerId, Number(page) || 1),
    getWatchProviders(),
  ]);

  const provider = providersData?.results?.find((p) => p.provider_id === providerId);
  const providerName = name || provider?.provider_name || "Unknown Provider";

  if (!data.results?.length) {
    return (
      <div className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto text-center">
        <p className="text-zinc-400">No movies found for {providerName}.</p>
        <Link href="/" className="text-red-500 hover:text-red-400 mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        {provider && (
          <img
            src={imgUrl(provider.logo_path, "w185")}
            alt={providerName}
            className="w-12 h-12 rounded-xl object-cover"
          />
        )}
        <h1 className="text-3xl font-bold text-white">{providerName}</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {data.results.map((m, i) => (
          <MovieCard key={m.id} movie={m} index={i} />
        ))}
      </div>

      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          {Number(page) > 1 && (
            <Link
              href={`/provider/${id}?name=${encodeURIComponent(providerName)}&page=${Number(page) - 1}`}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-lg text-sm transition"
            >
              Previous
            </Link>
          )}
          {Number(page || 1) < data.total_pages && (
            <Link
              href={`/provider/${id}?name=${encodeURIComponent(providerName)}&page=${Number(page || 1) + 1}`}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm transition"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
