import { registerAs } from '@nestjs/config';
import { CronExpression } from '@nestjs/schedule';

export const cronConfig = registerAs('cron', () => ({
  sessionsCleanup:
    process.env.CRON_SESSIONS_CLEANUP || CronExpression.EVERY_DAY_AT_MIDNIGHT,
}));
