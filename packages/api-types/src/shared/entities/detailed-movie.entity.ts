export type TDetailedMovieEntity = {
  id: number;
  budget: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  revenue: number;
  runtime: number;
  status: string;
  title: string;
  tagline: string;
  genres: string[];
  userWatchedAt: Date | null;
  userRating: number | null;
}
