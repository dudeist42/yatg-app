import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TmdbModule } from '../../tmdb/tmdb.module';
import { MoviesRepository } from './movies.repository';

@Module({
  imports: [TmdbModule],
  controllers: [MoviesController],
  providers: [MoviesRepository, MoviesService],
})
export class MoviesModule {}
