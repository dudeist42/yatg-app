export type TUserMovieEntity = {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string | null;
  releaseDate: string | null;
  userWatchedAt: Date;
  userRating: number | null;
}
