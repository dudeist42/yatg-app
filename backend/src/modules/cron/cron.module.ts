import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionsModule } from '../api/sessions/sessions.module';
import { ConfigModule } from '@nestjs/config';
import { cronConfig } from './cron.config';

@Module({
  imports: [
    ConfigModule.forFeature(cronConfig),
    ScheduleModule.forRoot(),
    SessionsModule,
  ],
  providers: [CronService],
})
export class CronModule {}
