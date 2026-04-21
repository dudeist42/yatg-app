import { Injectable } from '@nestjs/common';
import { DrizzleService, TDbTransaction } from '../../drizzle/drizzle.service';
import { DbMovie } from '../../../db/schema';
import { schema } from '../../../db';
import { eq } from 'drizzle-orm';
import { TmdbV3GetMovieByIdResponse } from '../../tmdb/tmdb.types';

@Injectable()
export class MoviesRepository {
  constructor(private drizzle: DrizzleService) {}

  async cacheMovie(
    movie: TmdbV3GetMovieByIdResponse,
    tx?: TDbTransaction,
  ): Promise<DbMovie> {
    const db = tx ?? this.drizzle.db;

    const [dbMovie] = await db
      .insert(schema.movies)
      .values({
        id: movie.id,
        title: movie.title,
        originalTitle: movie.original_title,
        posterPath: movie.poster_path,
        releaseDate: movie.release_date,
      })
      .returning();

    return dbMovie;
  }

  async findMovieById(movieId: number, tx?: TDbTransaction) {
    const db = tx ?? this.drizzle.db;

    const [movie] = await db
      .select()
      .from(schema.movies)
      .where(eq(schema.movies.id, movieId))
      .limit(1);

    return movie;
  }

  async findMovieByIdWithUserFields(
    userId: string,
    movieId: number,
    tx?: TDbTransaction,
  ) {
    const db = tx ?? this.drizzle.db;

    const result = await db.query.movies.findFirst({
      where: eq(schema.movies.id, movieId),
      columns: {
        cachedAt: false,
      },
      with: {
        userMovies: {
          where: eq(schema.userMovies.userId, userId),
          limit: 1,
          columns: {
            rating: true,
            watchedAt: true,
          },
        },
      },
    });

    if (!result) return undefined;

    const {
      userMovies: [userMovie],
      ...movie
    } = result;

    return {
      ...movie,
      userRating: userMovie?.rating ?? null,
      userWatchedAt: userMovie?.watchedAt ?? null,
    };
  }
}
