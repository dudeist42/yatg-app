'use server';
import { Suspense } from 'react';
import { Metadata } from 'next';
import { generateMovieByIdMetadata, MovieById } from '@/views/movie-by-id';

export type TMoviePageProps = PageProps<'/movie/[movieId]'>;

export const generateMetadata = async ({
  params,
}: TMoviePageProps): Promise<Metadata> => {
  const { movieId } = await params;

  return generateMovieByIdMetadata({ movieId: Number(movieId) });
};

export default async function MoviePage({ params }: TMoviePageProps) {
  const { movieId } = await params;

  return (
    <Suspense>
      <MovieById movieId={Number(movieId)} />
    </Suspense>
  );
}
