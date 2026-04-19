import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthReponse } from './responses/auth.response';
import { type FastifyRequestJwtRefresh } from './strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { type FastifyRequestJwtAccess } from './strategies/jwt-access.strategy';
import { UserResponse } from './responses/user.response';
import { User } from './entities/user.entity';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthReponse })
  async signUp(
    @Body() dto: SignUpDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthReponse> {
    const {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      accessTokenExpiresAt,
    } = await this.authService.signUp(dto);

    res.setCookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: refreshTokenExpiresAt,
    });
    res.setCookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      expires: accessTokenExpiresAt,
    });

    return { data: { accessToken, expiresAt: accessTokenExpiresAt } };
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AuthReponse })
  async signIn(
    @Body() dto: SignInDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthReponse> {
    const {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      accessTokenExpiresAt,
    } = await this.authService.signIn(dto);

    res.setCookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: refreshTokenExpiresAt,
    });
    res.setCookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      expires: accessTokenExpiresAt,
    });

    return { data: { accessToken, expiresAt: accessTokenExpiresAt } };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth('refresh-token')
  @ApiOkResponse({ type: AuthReponse })
  async refresh(
    @Req() req: FastifyRequestJwtRefresh,
    @Res({ passthrough: true }) res: FastifyReply,
  ): Promise<AuthReponse> {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await this.authService.refresh(req.user.userId, req.user.sessionId);

    res.setCookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: refreshTokenExpiresAt,
    });
    res.setCookie('access_token', accessToken, {
      ...COOKIE_OPTIONS,
      expires: accessTokenExpiresAt,
    });

    return { data: { accessToken, expiresAt: accessTokenExpiresAt } };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  async signOut(
    @Req() req: FastifyRequestJwtAccess,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    await this.authService.signOut(req.user.sessionId);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: UserResponse })
  me(@Req() req: FastifyRequestJwtAccess): UserResponse {
    const { user } = req;

    return new UserResponse(
      new User({
        id: user.userId,
        username: user.username,
        sessionId: user.sessionId,
      }),
    );
  }
}
