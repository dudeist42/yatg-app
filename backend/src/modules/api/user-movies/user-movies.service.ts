import { Injectable, NotFoundException } from '@nestjs/common';
import { UserMoviesRepository } from './user-movies.repository';
import { GetUserMoviesQueryDto } from './dto/get-user-movies.dto';
import { GetUserMoviesResponse } from './responses/get-user-movies.response';
import {
  getOffsetByPage,
  getTotalPages,
} from '../../../common/pagination/pagination.utils';
import { MoviesRepository } from '../movies/movies.repository';
import { DrizzleService, TDbTransaction } from '../../drizzle/drizzle.service';
import {
  UpsertUserMovieBodyDto,
  UpsertUserMovieParamsDto,
} from './dto/upsert-user-movie.dto';
import { TmdbService } from '../../tmdb/tmdb.service';
import { DeleteUserMovieParamsDto } from './dto/delete-user-movie.dto';

@Injectable()
export class UserMoviesService {
  constructor(
    private userMoviesRepository: UserMoviesRepository,
    private moviesRepository: MoviesRepository,
    private drizzleService: DrizzleService,
    private tmdbService: TmdbService,
  ) {}

  async getUserMovies(
    userId: string,
    { page, limit }: GetUserMoviesQueryDto,
  ): Promise<GetUserMoviesResponse> {
    const offset = getOffsetByPage(page, limit);
    const result = await this.userMoviesRepository.findAllUserMovies({
      userId,
      limit,
      offset,
    });
    const totalPages = getTotalPages(result.total, limit);

    return {
      data: result.movies,
      meta: {
        totalItems: result.total,
        totalPages,
        page,
      },
    };
  }

  async upsertWatched(
    userId: string,
    { movieId }: UpsertUserMovieParamsDto,
    body: UpsertUserMovieBodyDto,
  ) {
    await this.drizzleService.db.transaction(async (tx) => {
      const movie = await this.moviesRepository.findMovieById(movieId);

      if (!movie) {
        await this.syncMovie(movieId);
      }

      await this.userMoviesRepository.upsertWatched(
        {
          userId,
          movieId,
          rating: body.rating,
        },
        tx,
      );
    });
  }

  async deleteWatched(userId: string, { movieId }: DeleteUserMovieParamsDto) {
    await this.userMoviesRepository.deleteWatched({ userId, movieId });
  }

  private async syncMovie(movieId: number, tx?: TDbTransaction) {
    const movie = await this.tmdbService.getMovieById(movieId);

    if (movie.id) {
      const cachedMovie = await this.moviesRepository.cacheMovie(movie, tx);

      return cachedMovie;
    }

    throw new NotFoundException('Movie not found.');
  }
}
