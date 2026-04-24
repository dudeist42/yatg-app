import { Skeleton } from '@heroui/react';
import {
  MoviePosterWrapper,
  TMoviePosterWrapperProps,
} from './movie-poster-wrapper';

export type TMoviePosterSkeletonProps = Omit<
  TMoviePosterWrapperProps,
  'children'
>;

export const MoviePosterSkeleton = (props: TMoviePosterSkeletonProps) => {
  return (
    <MoviePosterWrapper {...props}>
      <Skeleton className="absolute inset-0" />
    </MoviePosterWrapper>
  );
};
