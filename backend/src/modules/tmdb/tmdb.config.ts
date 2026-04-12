import { registerAs } from '@nestjs/config';

export const tmdbConfig = registerAs('tmdb', () => ({
  apiUrl: process.env.TMDB_API_URL!,
  apiToken: process.env.TMDB_API_TOKEN!,
  imgBaseUrl: process.env.TMDB_IMAGE_BASE_URL!,
}));
