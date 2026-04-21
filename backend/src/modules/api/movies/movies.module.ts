import { forwardRef, Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from '../../tmdb/tmdb.module';
import { MoviesRepository } from './movies.repository';
import { UserMoviesModule } from '../user-movies/user-movies.module';

@Module({
  imports: [TmdbModule, forwardRef(() => UserMoviesModule)],
  controllers: [MoviesController],
  providers: [MoviesRepository, MoviesService],
  exports: [MoviesRepository],
})
export class MoviesModule {}
