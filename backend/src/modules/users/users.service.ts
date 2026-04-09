import { Injectable } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { DbNewUser, DbUser } from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { schema } from '../../db';

@Injectable()
export class UsersService {
  constructor(private drizzle: DrizzleService) {}

  async createUser(values: DbNewUser) {
    const [user] = await this.drizzle.db
      .insert(schema.users)
      .values(values)
      .returning();

    return user;
  }

  async findByUsername(username: string) {
    const [user] = await this.drizzle.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    return user;
  }

  async findById(id: string) {
    const [user] = await this.drizzle.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);

    return user;
  }

  async validatePassword(user: DbUser, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
