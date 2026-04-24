'use client';
import { DynamicBackground } from '@/shared/ui';
import { useLayoutEffect } from 'react';
import { useMovieField } from '../../model/selectors';

export const MovieBackground = () => {
  const backdropPath = useMovieField('backdropPath');
  const backdropSrc = backdropPath && `/api/tmdb-image/w1280${backdropPath}`;

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, []);

  if (!backdropPath) {
    return null;
  }

  return <DynamicBackground src={backdropSrc} />;
};
