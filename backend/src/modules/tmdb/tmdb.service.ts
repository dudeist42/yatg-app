import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { tmdbConfig } from './tmdb.config';
import { type ConfigType } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  TmdbV3GetMovieByIdQuery,
  TmdbV3GetMovieByIdResponse,
  TmdbV3SearchMovieQuery,
  TmdbV3SearchMovieResponse,
} from './tmdb.types';

@Injectable()
export class TmdbService {
  protected logger = new Logger(TmdbService.name);
  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly config: ConfigType<typeof tmdbConfig>,
    private httpService: HttpService,
  ) {}

  async searchMovies(query: TmdbV3SearchMovieQuery) {
    return this.get<TmdbV3SearchMovieResponse>('/v3/search/movie', query);
  }

  async getMovieById(id: number, query?: TmdbV3GetMovieByIdQuery) {
    return this.get<TmdbV3GetMovieByIdResponse>(`/v3/movie/${id}`, query);
  }

  private async get<Response>(path: string, query?: Record<string, unknown>) {
    try {
      const response = await firstValueFrom(
        this.httpService.get<Response>(`${this.config.apiUrl}${path}`, {
          params: {
            api_key: this.config.apiKey,
            ...query,
          },
        }),
      );

      return response.data;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(`TMDB Api error`, HttpStatus.BAD_GATEWAY);
    }
  }
}
