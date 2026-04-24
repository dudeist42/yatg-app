import { MoviePosterSkeleton } from '@/shared/ui';
import { MovieInfoSkeleton } from './ui/movie-info/movie-info-skeleton';
import { MovieOverviewSkeleton } from './ui/movie-overview/movie-overview-skeleton';

export const MovieDetailsSkeleton = () => {
  return (
    <div className="p-4 mb-30 relative text-white">
      <div className="flex flex-row max-sm:flex-col gap-12 max-sm:gap-6">
        <MoviePosterSkeleton size="xl" className="max-sm:self-center" />
        <div className="flex flex-col max-sm:items-center max-sm:text-center gap-1">
          <MovieInfoSkeleton />
        </div>
      </div>
      <MovieOverviewSkeleton />
    </div>
  );
};
