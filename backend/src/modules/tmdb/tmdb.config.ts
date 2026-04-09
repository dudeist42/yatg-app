import { registerAs } from '@nestjs/config';

export const tmdbConfig = registerAs('tmdb', () => ({
  apiUrl: process.env.TMDB_API_URL!,
  apiKey: process.env.TMDB_API_KEY!,
  imgBaseUrl: process.env.TMDB_IMAGE_BASE_URL!,
}));
