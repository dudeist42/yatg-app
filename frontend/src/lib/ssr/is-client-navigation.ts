import { headers } from 'next/headers';

// https://github.com/vercel/next.js/discussions/49824
export const isClientNavigation = async () => {
  const h = await headers();
  const secFetchDest = h.get('sec-fetch-dest');
  const secFetchMode = h.get('sec-fetch-mode');

  // Document navigations tend to have `sec-fetch-dest: document`
  // Client-side data/navigation requests often do not (comes with 'empty')
  if (secFetchDest && secFetchDest !== 'document') return true;

  // CORS requests are usually not full page navigations
  if (secFetchMode === 'cors') return true;

  return false;
};
