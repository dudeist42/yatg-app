import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { SessionsController } from './sessions.controller';

@Module({
  providers: [SessionsRepository, SessionsService],
  exports: [SessionsRepository, SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}
