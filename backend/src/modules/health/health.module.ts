import { Module } from '@nestjs/common';
import { DrizzleModule } from '../drizzle/drizzle.module';
import { HealthController } from './health.controller';

@Module({
  imports: [DrizzleModule],
  controllers: [HealthController],
})
export class HealthModule {}
