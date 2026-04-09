import { Controller, Get } from '@nestjs/common';
import { DrizzleService } from '../drizzle/drizzle.service';
import { sql } from 'drizzle-orm';

@Controller('health')
export class HealthController {
  constructor(private drizzle: DrizzleService) {}

  @Get()
  async checkHealth() {
    const isDbAlive = await this.getIsDbAlive();

    return {
      time: Date.now(),
      api: 'ok',
      db: isDbAlive ? 'ok' : 'fail',
    };
  }

  protected async getIsDbAlive(): Promise<boolean> {
    try {
      await this.drizzle.db.execute(sql`SELECT 1 as connected`);
      return true;
    } catch {
      return false;
    }
  }
}
