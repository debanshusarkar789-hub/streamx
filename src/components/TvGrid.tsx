import type { TvShow } from "@/lib/types";
import TvCard from "./TvCard";
import Link from "next/link";

interface Props {
  shows: TvShow[];
  title?: string;
  link?: string;
}

export default function TvGrid({ shows, title, link }: Props) {
  return (
    <section className="relative">
      {title && (
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
          {link && <Link href={link} className="text-sm text-zinc-500 hover:text-white transition font-medium">Explore All &rarr;</Link>}
        </div>
      )}
      <div className="row-scroll flex gap-2 md:gap-3 pb-2 -mx-4 px-4">
        {shows.map((show, i) => (
          <TvCard key={show.id} show={show} index={i} />
        ))}
      </div>
    </section>
  );
}
