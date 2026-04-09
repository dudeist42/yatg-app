import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { DbNewSession } from '../../db/schema';
import { and, eq, lt, not } from 'drizzle-orm';
import { schema } from '../../db';

@Injectable()
export class SessionsService {
  constructor(private drizzle: DrizzleService) {}

  async saveSession(data: DbNewSession) {
    await this.drizzle.db.insert(schema.sessions).values({
      createdAt: new Date(),
      lastUsedAt: new Date(),
      ...data,
    });
  }

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

  async findSessionsByUserId(userId: string) {
    return this.drizzle.db
      .select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, userId))
      .orderBy(schema.sessions.createdAt);
  }

  async deleteSessionById(sessionId: string) {
    await this.drizzle.db
      .delete(schema.sessions)
      .where(eq(schema.sessions.id, sessionId));
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
}
