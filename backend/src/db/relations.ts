import { relations } from 'drizzle-orm';
import { sessions, userMovies, users } from './schema';

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  userMovies: many(userMovies),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const userMoviesRelations = relations(userMovies, ({ one }) => ({
  users: one(users, {
    fields: [userMovies.userId],
    references: [users.id],
  }),
}));
