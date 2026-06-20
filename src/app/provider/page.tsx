import Link from "next/link";
import Image from "next/image";
import { getWatchProviders, imgUrl } from "@/lib/tmdb";

export default async function AllProvidersPage() {
  const data = await getWatchProviders();
  const providers = data?.results?.filter((p) => p.display_priority <= 90) || [];

  return (
    <div className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Streaming Providers</h1>
      <p className="text-zinc-400 mb-8">Browse movies available on your favorite streaming services</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-6">
        {providers.map((p) => (
          <Link
            key={p.provider_id}
            href={`/provider/${p.provider_id}?name=${encodeURIComponent(p.provider_name)}`}
            className="group flex flex-col items-center text-center"
            title={p.provider_name}
          >
            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 ring-2 ring-white/10 group-hover:ring-red-500/50 transition-all duration-200 group-hover:scale-105">
              <Image
                src={imgUrl(p.logo_path, "w185")}
                alt={p.provider_name}
                width={185}
                height={185}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2 group-hover:text-zinc-300 transition-colors line-clamp-1">
              {p.provider_name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
