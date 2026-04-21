import { TUserMovieEntity } from '@yatg-app/api-types';

export class UserMovieEntity implements TUserMovieEntity {
  id!: number;
  title!: string;
  originalTitle!: string;
  posterPath!: string | null;
  releaseDate!: string | null;
  userWatchedAt!: Date;
  userRating!: number | null;
}
