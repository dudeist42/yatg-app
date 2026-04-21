import { Injectable } from '@nestjs/common';
import { DrizzleService, TDbTransaction } from '../../drizzle/drizzle.service';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { schema } from '../../../db';

@Injectable()
export class UserMoviesRepository {
  constructor(private drizzle: DrizzleService) {}

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
        orderBy: desc(schema.userMovies.watchedAt),
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

  async upsertWatched(
    {
      movieId,
      userId,
      rating,
    }: { movieId: number; userId: string; rating?: number | null },
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

  async deleteWatched(
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
