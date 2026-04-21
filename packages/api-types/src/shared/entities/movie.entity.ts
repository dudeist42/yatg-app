export type TMovieEntity = {
  id: number;
  userRating: number | null;
  userWatchedAt: Date | null;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  releaseDate: string | null;
  title: string;
}