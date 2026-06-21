import { notFound } from "next/navigation";
import { getTvShow, getTvSeasonEpisodes, imgUrl, backdropUrl } from "@/lib/tmdb";
import { getTvEmbedUrl, getVixsrcTvUrl, getVidfastTvUrl, getVidnestTvUrl } from "@/lib/embed";
import TvWatchClient from "./TvWatchClient";

export const runtime = "edge";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export default async function TvWatchPage({ params }: Props) {
  const { slug } = await params;
  if (!slug || slug.length < 2) notFound();

  const [id, season, episode] = [Number(slug[0]), Number(slug[1] || 1), Number(slug[2] || 1)];
  if (!id) notFound();

  const show = await getTvShow(id);
  if (!show) notFound();

  let episodeTitle = `S${season}:E${episode}`;
  let episodes: any[] = [];
  try {
    const seasonData = await getTvSeasonEpisodes(id, season);
    episodes = seasonData.episodes || [];
    const ep = episodes.find((e) => e.episode_number === episode);
    if (ep) episodeTitle = ep.name;
  } catch {}

  return (
    <TvWatchClient
      showName={show.name}
      episodeTitle={episodeTitle}
      backdropSrc={backdropUrl(show.backdrop_path || show.poster_path)}
      posterSrc={imgUrl(show.poster_path)}
      posterPath={show.poster_path}
      nhdUrl={getTvEmbedUrl(show.id, season, episode)}
      vixsrcUrl={getVixsrcTvUrl(show.id, season, episode)}
      vidfastUrl={getVidfastTvUrl(show.id, season, episode)}
      vidnestUrl={getVidnestTvUrl(show.id, season, episode)}
      showId={show.id}
      season={season}
      episode={episode}
      seasons={show.seasons?.filter((s) => s.season_number > 0).map((s) => ({
        seasonNumber: s.season_number,
        name: s.name,
        episodeCount: s.episode_count,
        posterPath: s.poster_path,
      })) || []}
      currentSeasonEpisodes={episodes.map((e) => ({
        episodeNumber: e.episode_number,
        name: e.name,
        overview: e.overview,
        stillPath: e.still_path,
        airDate: e.air_date || "",
        voteAverage: e.vote_average || 0,
      }))}
    />
  );
}
