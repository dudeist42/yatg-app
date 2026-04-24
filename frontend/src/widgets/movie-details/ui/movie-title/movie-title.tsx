'use client';
import { useEffect } from 'react';
import { useMovieField } from '../../model/selectors';

export const MovieTitle = () => {
  const title = useMovieField('title');

  useEffect(() => {
    if (title) {
      document.title = `${title} | YATG`;
    }
  }, [title]);

  return null;
};
