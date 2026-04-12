import { Injectable } from '@nestjs/common';
import { DrizzleService, TDbTransaction } from '../../drizzle/drizzle.service';
import { DbMovie } from '../../../db/schema';
import { schema } from '../../../db';
import { and, eq, inArray, sql } from 'drizzle-orm';
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

  async findAllUserMovies(
    {
      userId,
      limit,
      offset,
    }: { userId: string; offset: number; limit: number },
    tx?: TDbTransaction,
  ) {
    const db = tx ?? this.drizzle.db;

    const [userMovies, total] = await Promise.all([
      db.query.userMovies.findMany({
        limit,
        offset,
        columns: {
          rating: true,
          watchedAt: true,
        },
        where: eq(schema.userMovies.userId, userId),
        with: {
          movie: {
            columns: {
              cachedAt: false,
            },
          },
        },
      }),
      db.$count(schema.userMovies, eq(schema.userMovies.userId, userId)),
    ]);

    const result = {
      total,
      movies: userMovies.map(({ movie, rating, watchedAt }) => ({
        ...movie,
        userRating: rating,
        userWatchedAt: watchedAt!,
      })),
    };

    return result;
  }

  async findUserMovies(
    { userId, movieIds }: { userId: string; movieIds: number[] },
    tx?: TDbTransaction,
  ) {
    const db = tx ?? this.drizzle.db;
    const userMovies = await db
      .select()
      .from(schema.userMovies)
      .where(
        and(
          eq(schema.userMovies.userId, userId),
          inArray(schema.userMovies.movieId, movieIds),
        ),
      );

    return userMovies;
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

  async setWatched(
    {
      movieId,
      userId,
      rating,
    }: { movieId: number; userId: string; rating?: number },
    tx?: TDbTransaction,
  ) {
    const db = tx ?? this.drizzle.db;

    await db
      .insert(schema.userMovies)
      .values({
        userId,
        movieId,
        watchedAt: new Date(),
        rating: rating,
      })
      .onConflictDoUpdate({
        target: [schema.userMovies.userId, schema.userMovies.movieId],
        set: {
          rating: sql`excluded.rating`,
        },
      });
  }

  async setUnwatched(
    { userId, movieId }: { userId: string; movieId: number },
    tx?: TDbTransaction,
  ) {
    const db = tx ?? this.drizzle.db;

    await db
      .delete(schema.userMovies)
      .where(
        and(
          eq(schema.userMovies.userId, userId),
          eq(schema.userMovies.movieId, movieId),
        ),
      );
  }
}
