import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../../drizzle/drizzle.service';
import { schema } from '../../../db';
import { and, desc, eq, gt, lt, not, sql } from 'drizzle-orm';
import { DbNewSession } from '../../../db/schema';

@Injectable()
export class SessionsRepository {
  constructor(private drizzle: DrizzleService) {}

  async findSessionByRefreshTokenId(refreshTokenId: string) {
    const [session] = await this.drizzle.db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.refreshTokenId, refreshTokenId))
      .limit(1);

    return session;
  }

  async findByAccessTokenId(accessTokenId: string) {
    const [session] = await this.drizzle.db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.accessTokenId, accessTokenId))
      .limit(1);

    return session;
  }

  async findSessionsByUserId(data: {
    userId: string;
    limit: number;
    offset: number;
  }) {
    const now = new Date();

    const where = and(
      eq(schema.sessions.userId, data.userId),
      gt(schema.sessions.expiresAt, now),
    );

    const [sessions, total] = await Promise.all([
      this.drizzle.db
        .select({
          id: schema.sessions.id,
          createdAt: schema.sessions.createdAt,
          lastUsedAt: schema.sessions.lastUsedAt,
        })
        .from(schema.sessions)
        .where(where)
        .orderBy(desc(schema.sessions.createdAt))
        .limit(data.limit)
        .offset(data.offset),
      this.drizzle.db.$count(schema.sessions, where),
    ]);

    return {
      total,
      data: sessions,
    };
  }

  async deleteSessionById(sessionId: string, userId?: string) {
    await this.drizzle.db
      .delete(schema.sessions)
      .where(
        and(
          eq(schema.sessions.id, sessionId),
          userId ? eq(schema.sessions.userId, userId) : undefined,
        ),
      );
  }

  async deleteSessionsByUserId(userId: string, excludeSessionId?: string) {
    await this.drizzle.db
      .delete(schema.sessions)
      .where(
        and(
          eq(schema.sessions.userId, userId),
          excludeSessionId
            ? not(eq(schema.sessions.id, excludeSessionId))
            : undefined,
        ),
      );
  }

  async deleteExpiredSessions() {
    const now = new Date();

    const result = await this.drizzle.db
      .delete(schema.sessions)
      .where(lt(schema.sessions.expiresAt, now))
      .returning({ id: schema.sessions.id });

    return result.length;
  }

  async saveSession(data: DbNewSession) {
    await this.drizzle.db
      .insert(schema.sessions)
      .values({
        createdAt: new Date(),
        lastUsedAt: new Date(),
        ...data,
      })
      .onConflictDoUpdate({
        target: schema.sessions.id,
        set: {
          refreshTokenId: sql`excluded.refresh_token_id`,
          accessTokenId: sql`excluded.access_token_id`,
          lastUsedAt: sql`excluded.last_used_at`,
          expiresAt: sql`excluded.expires_at`,
        },
      });
  }
}
