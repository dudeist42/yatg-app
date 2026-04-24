'use server';
import { UserMovies } from '@/views/user-movies';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <Suspense>
      <UserMovies />
    </Suspense>
  );
}
