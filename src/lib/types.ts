export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  original_language: string;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  tagline: string;
  budget: number;
  revenue: number;
  status: string;
  homepage: string;
  production_countries: { iso_3166_1: string; name: string }[];
  credits: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos: {
    results: Video[];
  };
  "watch/providers": WatchProviders;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface WatchProviders {
  results: {
    [country: string]: {
      link: string;
      flatrate?: Provider[];
      rent?: Provider[];
      buy?: Provider[];
    };
  };
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface ProviderResult {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
