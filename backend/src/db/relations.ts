import { relations } from 'drizzle-orm';
import { movies, sessions, userMovies, users } from './schema';

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  userMovies: many(userMovies),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  userMovies: many(userMovies),
}));

export const userMoviesRelations = relations(userMovies, ({ one }) => ({
  user: one(users, {
    fields: [userMovies.userId],
    references: [users.id],
  }),
  movie: one(movies, {
    fields: [userMovies.movieId],
    references: [movies.id],
  }),
}));
