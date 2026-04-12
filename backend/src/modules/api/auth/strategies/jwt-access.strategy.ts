import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { type ConfigType } from '@nestjs/config';
import { authConfig } from '../auth.config';
import { JwtPayload } from './types';
import { FastifyRequest } from 'fastify';
import { SessionsRepository } from '../../sessions/sessions.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    @Inject(authConfig.KEY)
    readonly config: ConfigType<typeof authConfig>,
    private sessionsRepository: SessionsRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const session = await this.sessionsRepository.findByAccessTokenId(
      payload.jti,
    );

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired or not found');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      jti: payload.jti,
      sessionId: session.id,
    };
  }
}

export type FastifyRequestJwtAccess = FastifyRequest & {
  user: Awaited<ReturnType<(typeof JwtStrategy)['prototype']['validate']>>;
};
