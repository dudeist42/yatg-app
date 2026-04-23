import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpBodyDto } from './dto/sign-up.dto';
import { SignInBodyDto } from './dto/sign-in.dto';
import { SignInResponse } from './responses/sign-in.response';
import { type FastifyRequestJwtRefresh } from './strategies/jwt-refresh.strategy';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { type FastifyRequestJwtAccess } from './strategies/jwt-access.strategy';
import { GetMeResponse } from './responses/me.response';
import { SignUpResponse } from './responses/sign-up.response';
import { RefreshTokenResponse } from './responses/refresh-token.response';
import { RefreshTokenBodyDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignUpResponse })
  async signUp(@Body() dto: SignUpBodyDto): Promise<SignUpResponse> {
    const data = await this.authService.signUp(dto);

    return {
      data,
    };
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SignInResponse })
  async signIn(@Body() dto: SignInBodyDto): Promise<SignInResponse> {
    const data = await this.authService.signIn(dto);

    return {
      data,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: RefreshTokenBodyDto })
  @ApiOkResponse({ type: RefreshTokenResponse })
  async refresh(
    @Req() req: FastifyRequestJwtRefresh,
  ): Promise<RefreshTokenResponse> {
    const data = await this.authService.refresh(
      req.user.userId,
      req.user.sessionId,
    );

    return { data };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  async signOut(@Req() req: FastifyRequestJwtAccess) {
    await this.authService.signOut(req.user.sessionId);
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: GetMeResponse })
  me(@Req() req: FastifyRequestJwtAccess): GetMeResponse {
    const { user } = req;

    return {
      data: {
        id: user.userId,
        username: user.username,
        sessionId: user.sessionId,
      },
    };
  }
}
