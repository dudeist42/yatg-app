import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from '../../db';

export type TDb = ReturnType<typeof drizzle<typeof schema>>;

@Injectable()
export class DrizzleService implements OnModuleDestroy {
  #logger = new Logger(DrizzleService.name);
  #connection: Pool;
  #db: TDb;

  get db() {
    return this.#db;
  }

  constructor() {
    this.#connection = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      maxUses: 7500,
    });
    this.#db = drizzle(this.#connection, {
      schema,
      logger: {
        logQuery: (query, params) => {
          console.log(query, params);
          this.#logger.verbose(query);
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.#connection.end();
  }
}
