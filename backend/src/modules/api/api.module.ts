import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    AuthModule,
    MoviesModule,
    RouterModule.register([
      {
        path: 'api/v1',
        children: [AuthModule, MoviesModule],
      },
    ]),
  ],
})
export class ApiModule {}
