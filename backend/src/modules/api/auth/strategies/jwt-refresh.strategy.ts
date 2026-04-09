import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { type ConfigType } from '@nestjs/config';
import { authConfig } from '../auth.config';
import { JwtPayload } from './types';
import { type FastifyRequest } from 'fastify';
import { SessionsService } from '../../../sessions/sessions.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(authConfig.KEY)
    readonly config: ConfigType<typeof authConfig>,
    private sessionsService: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: FastifyRequest) => req.cookies?.['refresh_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.jwtRefreshSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const session = await this.sessionsService.findSessionByRefreshTokenId(
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

export type FastifyRequestJwtRefresh = FastifyRequest & {
  user: Awaited<
    ReturnType<(typeof JwtRefreshStrategy)['prototype']['validate']>
  >;
};
