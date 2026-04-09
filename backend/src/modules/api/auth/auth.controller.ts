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
import { AuthService } from './auth.service';
import { SignUpDto, SignUpResponseDto } from './dto/sign-up.dto';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import Bowser from 'bowser';
import { SignInDto, SignInResponseDto } from './dto/sign-in.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { type FastifyRequestJwtRefresh } from './strategies/jwt-refresh.strategy';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { type FastifyRequestJwtAccess } from './strategies/jwt-access.strategy';
import { ApiBearerAuth, ApiCookieAuth, ApiOkResponse } from '@nestjs/swagger';

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
  @ApiOkResponse({ type: SignUpResponseDto })
  async signUp(
    @Body() dto: SignUpDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      accessTokenExpiresAt,
    } = await this.authService.signUp(dto, this.extractMetaFromReq(req));

    res.setCookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: refreshTokenExpiresAt,
    });

    return { accessToken, expiresAt: accessTokenExpiresAt };
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponseDto })
  async signIn(
    @Body() dto: SignInDto,
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt,
      accessTokenExpiresAt,
    } = await this.authService.signIn(dto, this.extractMetaFromReq(req));

    res.setCookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: refreshTokenExpiresAt,
    });

    return { accessToken, expiresAt: accessTokenExpiresAt };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth('refresh-token')
  @ApiOkResponse({ type: SignInDto })
  async refresh(
    @Req() req: FastifyRequestJwtRefresh,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    } = await this.authService.refresh(
      req.user.userId,
      req.user.sessionId,
      this.extractMetaFromReq(req),
    );

    res.setCookie('refresh_token', refreshToken, {
      ...COOKIE_OPTIONS,
      expires: refreshTokenExpiresAt,
    });

    return { accessToken, expiresAt: accessTokenExpiresAt };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  async signOut(
    @Req() req: FastifyRequestJwtRefresh,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    await this.authService.signOut(req.user.sessionId);
    res.clearCookie('refresh_token', COOKIE_OPTIONS);
  }

  @Post('revoke-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  async revokeAll(@Req() req: FastifyRequestJwtRefresh) {
    await this.authService.logoutAll(req.user.userId, req.user.sessionId);
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  me(@Req() req: FastifyRequestJwtAccess) {
    return req.user;
  }

  private extractMetaFromReq(req: FastifyRequest) {
    const ip = req.ip;
    let deviceName: string | undefined;
    const ua = req.headers['user-agent'];
    if (ua) {
      const parser = Bowser.getParser(ua);
      deviceName = `${parser.getOSName()} ${parser.getBrowserName()}`;
    }

    return { ip, deviceName };
  }
}
