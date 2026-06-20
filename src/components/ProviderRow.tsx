import Link from "next/link";
import Image from "next/image";
import { imgUrl } from "@/lib/tmdb";
import type { ProviderResult } from "@/lib/types";

interface Props {
  providers: ProviderResult[];
  link?: string;
}

export default function ProviderRow({ providers, link }: Props) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Streaming by Provider</h2>
        {link && (
          <Link
            href={link}
            className="text-sm text-zinc-500 hover:text-white transition font-medium"
          >
            Explore All &rarr;
          </Link>
        )}
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
        {providers.map((p) => (
          <Link
            key={p.provider_id}
            href={`/provider/${p.provider_id}?name=${encodeURIComponent(p.provider_name)}`}
            className="shrink-0 group text-center"
            title={p.provider_name}
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white/5 ring-2 ring-white/10 group-hover:ring-red-500/50 transition-all duration-200 group-hover:scale-110">
              <Image
                src={imgUrl(p.logo_path, "w185")}
                alt={p.provider_name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] md:text-xs text-zinc-500 mt-1.5 truncate max-w-[5rem] group-hover:text-zinc-300 transition-colors">
              {p.provider_name}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
