import { Injectable } from '@nestjs/common';
import { TmdbService } from '../../tmdb/tmdb.service';
import { FindMoviesQueryDto } from './dto/find-movies.dto';
import { MovieEntity } from './entities/movie.entity';
import { DetailedMovie } from './entities/detailed-movie.entity';
import { MoviesRepository } from './movies.repository';
import {
  TmdbV3GetMovieByIdResponse,
  TmdbV3SearchMovieResultItem,
} from '../../tmdb/tmdb.types';
import { PaginatedResponse } from '../../../common/pagination/pagination.response';
import { UserMoviesRepository } from '../user-movies/user-movies.repository';

@Injectable()
export class MoviesService {
  constructor(
    private tmdbService: TmdbService,
    private moviesRepository: MoviesRepository,
    private userMoviesRepository: UserMoviesRepository,
  ) {}

  async search(
    userId: string,
    query: FindMoviesQueryDto,
  ): Promise<PaginatedResponse<MovieEntity>> {
    const tmdbSearchResult = await this.tmdbService.searchMovies(query);

    const movieIds = tmdbSearchResult.results.map((movie) => movie.id);

    const userMovies = await this.userMoviesRepository.findUserMovies({
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

  private tmdbToMovieEntity(
    tmdbMovie: TmdbV3GetMovieByIdResponse,
  ): DetailedMovie {
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
  ): MovieEntity {
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
