import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { cronConfig } from './cron.config';
import { type ConfigType } from '@nestjs/config';
import * as cron from 'cron/dist/job';
import { SessionsRepository } from '../api/sessions/sessions.repository';

@Injectable()
export class CronService implements OnModuleInit {
  private logger = new Logger(CronService.name);
  constructor(
    @Inject(cronConfig.KEY)
    private config: ConfigType<typeof cronConfig>,
    private scheduleRegistry: SchedulerRegistry,
    private sessionsRepository: SessionsRepository,
  ) {}

  onModuleInit() {
    this.registerCleanupExpiredSessions();
  }

  registerCleanupExpiredSessions = () => {
    const cronJobName = 'cleanupExpiredSessions';
    const cleanupExpiredSessionsJob = new cron.CronJob(
      this.config.sessionsCleanup,
      this.cleanupExpiredSessions,
    );
    this.scheduleRegistry.addCronJob(cronJobName, cleanupExpiredSessionsJob);

    cleanupExpiredSessionsJob.start();

    this.logger.log(
      `Task "${cronJobName}" registered. cron = ${this.config.sessionsCleanup}`,
    );
  };

  cleanupExpiredSessions = async () => {
    const count = await this.sessionsRepository.deleteExpiredSessions();

    this.logger.log(`Deleted "${count}" expired sessions`);
  };
}
