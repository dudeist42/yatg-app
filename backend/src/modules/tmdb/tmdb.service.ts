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
import { isAxiosError } from 'axios';

@Injectable()
export class TmdbService {
  protected logger = new Logger(TmdbService.name);
  constructor(
    @Inject(tmdbConfig.KEY)
    private readonly config: ConfigType<typeof tmdbConfig>,
    private httpService: HttpService,
  ) {}

  async searchMovies(query: TmdbV3SearchMovieQuery) {
    return this.get<TmdbV3SearchMovieResponse>('/3/search/movie', query);
  }

  async getMovieById(id: number, query?: TmdbV3GetMovieByIdQuery) {
    return this.get<TmdbV3GetMovieByIdResponse>(`/3/movie/${id}`, query);
  }

  private async get<Response>(path: string, query?: Record<string, unknown>) {
    try {
      const url = `${this.config.apiUrl}${path}`;
      this.logger.verbose(`Request TMDB "${url}"`);
      const response = await firstValueFrom(
        this.httpService.get<Response>(url, {
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
          },
          params: query,
        }),
      );

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const response = error.response.data as unknown;

        this.logger.warn('TMDB Request Error: ', response);
        const message =
          response &&
          typeof response === 'object' &&
          'status_message' in response
            ? String(response.status_message)
            : 'Unknown Error';

        throw new HttpException(
          message,
          error.status ?? HttpStatus.BAD_GATEWAY,
        );
      }

      this.logger.error(error instanceof Error ? error.message : error);
      throw new HttpException(`Server error`, HttpStatus.BAD_GATEWAY);
    }
  }
}
