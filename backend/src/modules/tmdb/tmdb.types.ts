export type TmdbV3SearchMovieResultItem = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TmdbV3SearchMovieQuery = {
  query: string;
  include_adult?: boolean;
  language?: string;
  primary_release_year?: string;
  page?: number;
  region?: string;
  year?: string;
};

export type TmdbV3SearchMovieResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbV3SearchMovieResultItem[];
};

export type TmdbV3GetMovieByIdResponse = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: TmdbV3BelongsToCollection | null;
  budget: number;
  genres: TmdbV3Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: TmdbV3ProductionCompany[];
  production_countries: TmdbV3ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: TmdbV3SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type TmdbV3GetMovieByIdQuery = {
  language?: string;
  append_to_response?: string;
};

export type TmdbV3BelongsToCollection = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
};

export type TmdbV3Genre = {
  id: number;
  name: string;
};

export type TmdbV3ProductionCompany = {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
};

export type TmdbV3ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type TmdbV3SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};
