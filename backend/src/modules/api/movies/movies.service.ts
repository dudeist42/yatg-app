import { Injectable, NotFoundException } from '@nestjs/common';
import { DrizzleService, TDbTransaction } from '../../drizzle/drizzle.service';
import { TmdbService } from '../../tmdb/tmdb.service';
import { FindMoviesQueryDto } from './dto/find-movies.dto';
import { FindMovieItem } from './entities/find-movie.entity';
import { Movie } from './entities/movie.entity';
import { WatchMovieBodyDto } from './dto/watch-movie.dto';
import { MoviesRepository } from './movies.repository';
import {
  getOffsetByPage,
  getTotalPages,
} from '../../../common/pagination/pagination.utils';
import { GetUserMoviesResponse } from './responses/find-user-movies.response';
import {
  TmdbV3GetMovieByIdResponse,
  TmdbV3SearchMovieResultItem,
} from '../../tmdb/tmdb.types';
import { PaginatedResponse } from '../../../common/pagination/pagination.response';

@Injectable()
export class MoviesService {
  constructor(
    private drizzleService: DrizzleService,
    private tmdbService: TmdbService,
    private moviesRepository: MoviesRepository,
  ) {}

  async search(
    userId: string,
    query: FindMoviesQueryDto,
  ): Promise<PaginatedResponse<FindMovieItem>> {
    const tmdbSearchResult = await this.tmdbService.searchMovies(query);

    const movieIds = tmdbSearchResult.results.map((movie) => movie.id);

    const userMovies = await this.moviesRepository.findUserMovies({
      userId,
      movieIds,
    });
    const userMoviesMap = new Map(
      userMovies.map((userMovie) => [userMovie.movieId, userMovie]),
    );

    const result = {
      meta: {
        page: tmdbSearchResult.page,
        totalPages: tmdbSearchResult.total_pages,
        totalItems: tmdbSearchResult.total_results,
      },
      data: tmdbSearchResult.results.map((movie) => {
        const userMovie = userMoviesMap.get(movie.id);
        return {
          ...this.tmdbSearchToFindMovie(movie),
          userRating: userMovie?.rating ?? null,
          userWatchedAt: userMovie?.watchedAt ?? null,
        };
      }),
    };

    return result;
  }

  async watch(userId: string, movieId: number, params: WatchMovieBodyDto) {
    await this.drizzleService.db.transaction(async (tx) => {
      const movie = await this.moviesRepository.findMovieById(movieId);

      if (!movie) {
        await this.syncMovie(movieId);
      }

      await this.moviesRepository.setWatched(
        {
          userId,
          movieId,
          rating: params.rating,
        },
        tx,
      );
    });
  }

  async unwatch(userId: string, movieId: number) {
    await this.moviesRepository.setUnwatched({ userId, movieId });
  }

  async getMovieById(userId: string, movieId: number) {
    const [dbMovie, tmdbMovie] = await Promise.all([
      this.moviesRepository.findMovieByIdWithUserFields(userId, movieId),
      this.tmdbService.getMovieById(movieId),
    ]);

    if (!dbMovie && tmdbMovie) {
      await this.moviesRepository.cacheMovie(tmdbMovie);
    }

    return {
      data: {
        ...this.tmdbToMovieEntity(tmdbMovie),
        userWatchedAt: dbMovie?.userWatchedAt ?? null,
        userRating: dbMovie?.userRating ?? null,
      },
    };
  }

  async getUserMovies(
    userId: string,
    limit: number,
    page: number,
  ): Promise<GetUserMoviesResponse> {
    const offset = getOffsetByPage(page, limit);
    const result = await this.moviesRepository.findAllUserMovies({
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

  private async syncMovie(movieId: number, tx?: TDbTransaction) {
    const movie = await this.tmdbService.getMovieById(movieId);

    if (movie.id) {
      const cachedMovie = await this.moviesRepository.cacheMovie(movie, tx);

      return cachedMovie;
    }

    throw new NotFoundException('Movie not found.');
  }

  private tmdbToMovieEntity(tmdbMovie: TmdbV3GetMovieByIdResponse): Movie {
    return {
      id: tmdbMovie.id,
      budget: tmdbMovie.budget,
      originalLanguage: tmdbMovie.original_language,
      originalTitle: tmdbMovie.original_title,
      overview: tmdbMovie.overview,
      posterPath: tmdbMovie.poster_path,
      backdropPath: tmdbMovie.backdrop_path,
      releaseDate: tmdbMovie.release_date,
      revenue: tmdbMovie.revenue,
      runtime: tmdbMovie.runtime,
      status: tmdbMovie.status,
      title: tmdbMovie.title,
      tagline: tmdbMovie.tagline,
      genres: tmdbMovie.genres.map((genre) => genre.name),
      userWatchedAt: null,
      userRating: null,
    };
  }

  private tmdbSearchToFindMovie(
    movie: TmdbV3SearchMovieResultItem,
  ): FindMovieItem {
    return {
      id: movie.id,
      originalLanguage: movie.original_language,
      originalTitle: movie.original_title,
      overview: movie.overview,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      title: movie.title,
      userRating: null,
      userWatchedAt: null,
    };
  }
}
