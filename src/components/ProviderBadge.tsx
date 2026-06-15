import { imgUrl } from "@/lib/tmdb";
import type { Provider } from "@/lib/types";

interface Props {
  provider: Provider;
}

export default function ProviderBadge({ provider }: Props) {
  return (
    <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition cursor-default">
      <img
        src={imgUrl(provider.logo_path, "w92")}
        alt={provider.provider_name}
        className="w-8 h-8 rounded object-cover bg-white"
      />
      <span className="text-sm text-zinc-300 font-medium">{provider.provider_name}</span>
    </div>
  );
}
