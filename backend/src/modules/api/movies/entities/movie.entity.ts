export class Movie {
  id!: number;
  budget!: number;
  originalLanguage!: string;
  originalTitle!: string;
  overview!: string;
  posterPath!: string;
  backdropPath!: string;
  releaseDate!: string;
  revenue!: number;
  runtime!: number;
  status!: string;
  title!: string;
  userWatchedAt!: Date | null;
  userRating!: number | null;
}
