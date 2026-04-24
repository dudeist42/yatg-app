import { ReactNode } from 'react';
import { calcMoviePosterSize, PosterSize } from './movie-poster.utils';
import clsx from 'clsx';

export type TMoviePosterWrapperProps = {
  size?: keyof typeof PosterSize;
  width?: number;
  height?: number;
  className?: string;
  children: ReactNode;
};

export const MoviePosterWrapper = ({
  size = 'xs',
  width,
  height,
  className,
  children,
}: TMoviePosterWrapperProps) => {
  const { width: w, height: h } = calcMoviePosterSize({
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
      {children}
    </div>
  );
};
