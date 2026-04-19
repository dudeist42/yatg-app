import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from '../../db';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export type TDb = ReturnType<typeof drizzle<typeof schema>>;
export type TDbTransaction = PgTransaction<
  PgQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

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
        logQuery: (query) => {
          this.#logger.verbose(query);
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.#connection.end();
  }
}
