import { UserMovieCard } from '@/entities/user-movies/ui';
import { UserMoviesWrapper } from '../user-movies-wrapper';

export type TUserMoviesListSkeletonProps = {
  items?: number;
};

export const UserMoviesListSkeleton = ({
  items = 10,
}: TUserMoviesListSkeletonProps) => {
  return (
    <UserMoviesWrapper>
      {Array.from({ length: items }, (_, idx) => (
        <UserMovieCard key={idx} />
      ))}
    </UserMoviesWrapper>
  );
};
