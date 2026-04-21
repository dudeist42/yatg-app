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
import { SessionEntity } from './entities/session.entity';
import { type FastifyRequestJwtAccess } from '../auth/strategies/jwt-access.strategy';
import { GetSessionsQueryDto } from './dto/get-sessions.dto';
import { GetSessionsResponse } from './responses/get-user-sessions.response';
import { DeleteSessionParamsDto } from './dto/delete-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(SessionEntity)
  getSessions(
    @Req() req: FastifyRequestJwtAccess,
    @Query() query: GetSessionsQueryDto,
  ): Promise<GetSessionsResponse> {
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
