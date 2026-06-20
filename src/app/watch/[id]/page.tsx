import { notFound } from "next/navigation";
import { getMovie, imgUrl, backdropUrl } from "@/lib/tmdb";
import { getMovieEmbedUrl, getVixsrcMovieUrl, getVidfastMovieUrl } from "@/lib/embed";
import WatchClient from "./WatchClient";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WatchPage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovie(Number(id));
  if (!movie) notFound();

  return (
    <WatchClient
      movieTitle={movie.title}
      backdropSrc={backdropUrl(movie.backdrop_path || movie.poster_path)}
      posterSrc={imgUrl(movie.poster_path)}
      posterPath={movie.poster_path}
      nhdUrl={getMovieEmbedUrl(movie.id)}
      vixsrcUrl={getVixsrcMovieUrl(movie.id)}
      vidfastUrl={getVidfastMovieUrl(movie.id)}
      movieId={movie.id}
    />
  );
}
