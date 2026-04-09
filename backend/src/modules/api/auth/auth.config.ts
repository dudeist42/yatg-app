import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  jwtSecret: process.env.JWT_SECRET ?? 'jwt_secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? 'jwt_refresh_secret',
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN as `${number}`) ?? '15m',
  jwtRefreshExpiresIn:
    (process.env.JWT_REFRESH_EXPIRES_IN as `${number}`) ?? '7d',
}));
