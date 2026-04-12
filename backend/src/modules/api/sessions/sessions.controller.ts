import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../common/pagination/pagination.decorator';
import { UserSession } from './entities/user-session.entity';
import { type FastifyRequestJwtAccess } from '../auth/strategies/jwt-access.strategy';
import { GetUserSessionsQueryDto } from './dto/get-sessions.dto';
import { GetUserSessionsResponse } from './responses/get-user-sessions.response';
import { DeleteSessionParamsDto } from './dto/delete-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(UserSession)
  getSessions(
    @Req() req: FastifyRequestJwtAccess,
    @Query() query: GetUserSessionsQueryDto,
  ): Promise<GetUserSessionsResponse> {
    return this.sessionsService.findSessionsByUserId(req.user.userId, query);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  deleteAllSessions(@Req() req: FastifyRequestJwtAccess): Promise<void> {
    return this.sessionsService.deleteSessionsByUserId(
      req.user.userId,
      req.user.sessionId,
    );
  }

  @Delete(':sessionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  deleteSessionById(
    @Req() req: FastifyRequestJwtAccess,
    @Param() params: DeleteSessionParamsDto,
  ): Promise<void> {
    return this.sessionsService.deleteSessionById(
      params.sessionId,
      req.user.userId,
    );
  }
}
