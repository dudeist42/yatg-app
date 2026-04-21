import { forwardRef, Module } from '@nestjs/common';
import { UserMoviesService } from './user-movies.service';
import { UserMoviesController } from './user-movies.controller';
import { UserMoviesRepository } from './user-movies.repository';
import { TmdbModule } from '../../tmdb/tmdb.module';
import { MoviesModule } from '../movies/movies.module';

@Module({
  imports: [TmdbModule, forwardRef(() => MoviesModule)],
  providers: [UserMoviesRepository, UserMoviesService],
  controllers: [UserMoviesController],
  exports: [UserMoviesRepository],
})
export class UserMoviesModule {}
