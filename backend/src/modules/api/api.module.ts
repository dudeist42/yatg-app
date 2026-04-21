import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { SessionsModule } from './sessions/sessions.module';
import { UserMoviesModule } from './user-movies/user-movies.module';

@Module({
  imports: [
    AuthModule,
    MoviesModule,
    SessionsModule,
    RouterModule.register([
      {
        path: 'api/v1',
        children: [AuthModule, MoviesModule, UserMoviesModule, SessionsModule],
      },
    ]),
    UserMoviesModule,
  ],
})
export class ApiModule {}
