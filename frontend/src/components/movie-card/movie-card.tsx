import { EyeIcon } from '@phosphor-icons/react';
import { ComponentProps, ElementType } from 'react';
import styles from './movie-card.module.css';
import clsx from 'clsx';

/* eslint-disable @next/next/no-img-element */
export type TPosterWidth = 92 | 154 | 185 | 342 | 500 | 780;

export type TMovieCardProps<Component extends ElementType> =
  ComponentProps<Component> & {
    As?: Component;
    posterWidth?: TPosterWidth;
    posterPath?: string | null;
    releaseDate?: string | null;
    watched?: boolean | null;
    rating?: number | null;
    title?: string;
    className?: string;
  };

export const MovieCard = <Component extends ElementType>({
  posterWidth,
  posterPath,
  releaseDate,
  watched,
  rating,
  title,
  className,
  As = 'div',
  ...rootProps
}: TMovieCardProps<Component>) => {
  const srcWidth = posterWidth ? `w${posterWidth}` : 'original';
  const imgWidth = posterWidth ? posterWidth / 2 : undefined;
  const imgHeight = imgWidth ? imgWidth * 1.5 : undefined;
  const src = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL}/t/p/${srcWidth}/${posterPath}`;
  const releaseYear = releaseDate
    ? new Date(releaseDate).getFullYear()
    : undefined;

  return (
    <As
      {...rootProps}
      className={clsx(styles.root, className)}
      style={{
        maxWidth: `${imgWidth}px`,
      }}
    >
      <div className={styles.card}>
        {posterPath && (
          <img
            width={imgWidth}
            height={imgHeight}
            alt=""
            loading="lazy"
            src={src}
          />
        )}
        {(watched || rating) && (
          <div className={styles.userMarker}>
            {watched && !rating && <EyeIcon size={20} />}
            {!!rating && <div className="font-semibold">{rating}</div>}
          </div>
        )}
      </div>
      {(title || releaseYear) && (
        <div>
          {!!title && <div className={styles.title}>{title}</div>}
          {!!releaseYear && (
            <div className={styles.subtitle}>{releaseYear}</div>
          )}
        </div>
      )}
    </As>
  );
};
