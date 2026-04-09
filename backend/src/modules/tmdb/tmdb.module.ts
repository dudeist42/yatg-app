import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { tmdbConfig } from './tmdb.config';
import { TmdbService } from './tmdb.service';

@Module({
  imports: [ConfigModule.forFeature(tmdbConfig), HttpModule],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
