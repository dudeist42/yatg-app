export class UserMovieItem {
  id!: number;
  title!: string;
  originalTitle!: string;
  posterPath!: string;
  releaseDate!: string;
  userWatchedAt!: Date;
  userRating!: number | null;
}
