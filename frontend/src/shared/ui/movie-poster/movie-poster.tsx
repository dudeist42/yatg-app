/* eslint-disable @next/next/no-img-element */
'use client';
import { useImageLoaded } from '@/shared/lib/hooks/useImageLoaded';
import { Skeleton, Surface } from '@heroui/react';
import { ImageIcon } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useRef } from 'react';

const ASPECT_RATIO = 2 / 3;

export const PosterSize = {
  xs: 92,
  s: 154,
  m: 185,
  l: 342,
  xl: 500,
  xxl: 780,
} as const;

export type TMoviePosterProps = {
  path?: string | null;
  size?: keyof typeof PosterSize;
  width?: number;
  height?: number;
  loading?: boolean;
  className?: string;
};

const calcSize = ({
  width,
  height,
  size,
}: {
  width?: number;
  height?: number;
  size: keyof typeof PosterSize;
}) => {
  const computedWidth =
    width ?? (height ? height * ASPECT_RATIO : PosterSize[size] / 2);

  return {
    width: computedWidth,
    height: height ?? computedWidth / ASPECT_RATIO,
  };
};

export const MoviePoster = ({
  size = 'xs',
  path,
  width,
  height,
  loading,
  className,
}: TMoviePosterProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const posterWidth = PosterSize[size];
  const imgSrc = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/t/p/w${posterWidth}${path}`;
  const showImg = !!path && !loading;
  const loaded = useImageLoaded(imgRef, showImg);
  const showSkeleton = loading || (showImg && !loaded);

  const { width: w, height: h } = calcSize({
    size,
    width,
    height,
  });

  return (
    <div
      className={clsx(
        'relative rounded-xl shrink-0 grow-0 overflow-hidden',
        className,
      )}
      style={{ width: w, height: h }}
    >
      {showImg && (
        <img
          ref={imgRef}
          className={clsx('w-full h-full', !loaded && 'opacity-0')}
          alt=""
          loading="lazy"
          width={w}
          height={h}
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
      {showSkeleton && (
        <Skeleton className="absolute top-0 left-0 w-full h-full" />
      )}
    </div>
  );
};
