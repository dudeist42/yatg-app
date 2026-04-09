import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { PasswordPwndValidationModule } from './modules/password-pwnd/password-pwned.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { TmdbModule } from './modules/tmdb/tmdb.module';
import { CronModule } from './modules/cron/cron.module';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [
    DrizzleModule,
    PasswordPwndValidationModule,
    UsersModule,
    SessionsModule,
    TmdbModule,
    CronModule,
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
