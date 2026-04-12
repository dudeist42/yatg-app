import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { PasswordPwndValidationModule } from './modules/password-pwnd/password-pwned.module';
import { TmdbModule } from './modules/tmdb/tmdb.module';
import { CronModule } from './modules/cron/cron.module';
import { ApiModule } from './modules/api/api.module';

@Module({
  imports: [
    DrizzleModule,
    PasswordPwndValidationModule,
    UsersModule,
    TmdbModule,
    CronModule,
    ApiModule,
  ],
  providers: [AppService],
})
export class AppModule {}
