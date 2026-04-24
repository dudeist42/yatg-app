'use client';
import { useMovieIsFetching } from '../../model/selectors';
import { DetailedMoviePoster } from '../detailed-movie-poster';
import { MovieInfo } from '../movie-info';
import { MovieInfoSkeleton } from '../movie-info';
import { MovieOverview } from '../movie-overview';
import { MovieOverviewSkeleton } from '../movie-overview';
import { MovieRating } from '../movie-rating';
import { MovieWatchToggle } from '../movie-watch-toggle';

export const DetailedMovie = () => {
  const isLoading = useMovieIsFetching();

  return (
    <div className="p-4 mb-30 relative text-white">
      <div className="flex flex-row max-sm:flex-col gap-12 max-sm:gap-6">
        <DetailedMoviePoster />
        <div className="flex flex-col max-sm:items-center max-sm:text-center gap-1">
          {isLoading ? <MovieInfoSkeleton /> : <MovieInfo />}
          {!isLoading && (
            <div className="flex flex-col max-sm:flex-row gap-5 mt-10">
              <MovieWatchToggle />
              <MovieRating />
            </div>
          )}
        </div>
      </div>
      {isLoading ? <MovieOverviewSkeleton /> : <MovieOverview />}
    </div>
  );
};
