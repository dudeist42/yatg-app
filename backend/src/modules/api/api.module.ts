import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    AuthModule,
    MoviesModule,
    SessionsModule,
    RouterModule.register([
      {
        path: 'api/v1',
        children: [AuthModule, MoviesModule, SessionsModule],
      },
    ]),
  ],
})
export class ApiModule {}
