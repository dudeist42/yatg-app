import { sql } from 'drizzle-orm';
import {
  pgTable,
  foreignKey,
  varchar,
  index,
  timestamp,
  integer,
  check,
  unique,
} from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';
import { VarcharLen } from './types';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: VarcharLen.TINY })
      .primaryKey()
      .$defaultFn(() => createId()),
    username: varchar('username', { length: VarcharLen.USERNAME })
      .notNull()
      .unique(),
    password: varchar('password', { length: VarcharLen.MEDIUM }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index('users_username_idx').on(t.username)],
);

export type DbUser = typeof users.$inferSelect;
export type DbNewUser = typeof users.$inferInsert;

export const sessions = pgTable(
  'user_sessions',
  {
    id: varchar('id', { length: VarcharLen.TINY })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar('user_id', { length: VarcharLen.TINY }).notNull(),
    refreshTokenId: varchar('refresh_token_id', { length: VarcharLen.UUIDV4 })
      .notNull()
      .unique(),
    accessTokenId: varchar('access_token_id', { length: VarcharLen.UUIDV4 }),
    deviceName: varchar('device_name', { length: VarcharLen.SHORT }),
    ipAddress: varchar('ip_address', { length: VarcharLen.IP }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    lastUsedAt: timestamp('last_used_at').defaultNow().notNull(),
  },
  (t) => [
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: 'user_sessions_user_id_fkey',
    }).onDelete('cascade'),
    index('user_sessions_expires_at_idx').on(t.expiresAt),
    index('user_sessions_user_id_idx').on(t.userId),
    index('user_sessions_refresh_token_id_idx').on(t.refreshTokenId),
    index('user_sessions_access_token_id_idx').on(t.accessTokenId),
  ],
);

export type DbSession = typeof sessions.$inferSelect;
export type DbNewSession = typeof sessions.$inferInsert;

export const userMovies = pgTable(
  'user_movies',
  {
    id: varchar('id', { length: VarcharLen.TINY })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar('user_id', { length: VarcharLen.TINY }).notNull(),
    movieId: integer('movie_id').notNull(),
    rating: integer('rating'),
    watchedAt: timestamp('watched_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    foreignKey({
      columns: [t.userId],
      foreignColumns: [users.id],
      name: 'user_movies_user_id_fkey',
    }).onDelete('cascade'),
    index('user_movies_user_id_idx').on(t.userId),
    index('user_movies_movie_id_idx').on(t.movieId),
    unique('user_movies_user_movie_unique').on(t.userId, t.movieId),
    check(
      'user_movies_rating_constraint',
      sql`${t.rating} IS NULL OR (${t.rating} >= 1 AND ${t.rating} <= 5)`,
    ),
  ],
);

export type DbUserMovie = typeof userMovies.$inferSelect;
export type DbNewUserMovie = typeof userMovies.$inferInsert;
