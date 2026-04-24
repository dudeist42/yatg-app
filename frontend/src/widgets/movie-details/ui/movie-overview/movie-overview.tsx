'use client';
import { useMovieField } from '../../model/selectors';

export const MovieOverview = () => {
  const overview = useMovieField('overview');

  return (
    <div className="mt-15 flex flex-col gap-4 max-w-4xl">
      <span className="text-2xl font-bold">Overview</span>
      <span className="text-xl">{overview}</span>
    </div>
  );
};
