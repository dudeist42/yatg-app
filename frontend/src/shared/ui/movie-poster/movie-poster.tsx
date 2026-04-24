/* eslint-disable @next/next/no-img-element */
'use client';
import { useImageLoaded } from '@/shared/lib/hooks/useImageLoaded';
import { Skeleton, Surface } from '@heroui/react';
import { ImageIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { PosterSize } from './movie-poster.utils';
import {
  MoviePosterWrapper,
  TMoviePosterWrapperProps,
} from './movie-poster-wrapper';

export type TMoviePosterProps = {
  path?: string | null;
  size?: keyof typeof PosterSize;
  loading?: boolean;
} & Omit<TMoviePosterWrapperProps, 'children'>;

export const MoviePoster = ({
  size = 'xs',
  path,
  loading,
  ...wrapperProps
}: TMoviePosterProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const posterWidth = PosterSize[size];
  const imgSrc = `/api/tmdb-image/t/p/w${posterWidth}${path}`;
  const showImg = !!path && !loading;
  const loaded = useImageLoaded(imgRef, showImg);
  const showSkeleton = loading || (showImg && !loaded);

  return (
    <MoviePosterWrapper {...wrapperProps} size={size}>
      {showImg && (
        <img
          ref={imgRef}
          className={clsx('w-full h-full', !loaded && 'opacity-0')}
          alt=""
          loading="lazy"
          src={imgSrc}
        />
      )}
      {!path && !loading && (
        <Surface
          variant="secondary"
          className="flex items-center justify-center text-muted w-full h-full"
        >
          <ImageIcon size={32} />
        </Surface>
      )}
      {showSkeleton && <Skeleton className="absolute inset-0" />}
    </MoviePosterWrapper>
  );
};
