import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../common/pagination/pagination.decorator';
import { GetUserMoviesResponse } from './responses/get-user-movies.response';
import { type FastifyRequestJwtAccess } from '../auth/strategies/jwt-access.strategy';
import { GetUserMoviesQueryDto } from './dto/get-user-movies.dto';
import { UserMoviesService } from './user-movies.service';
import {
  UpsertUserMovieBodyDto,
  UpsertUserMovieParamsDto,
} from './dto/upsert-user-movie.dto';
import { DeleteUserMovieParamsDto } from './dto/delete-user-movie.dto';

@Controller('user-movies')
export class UserMoviesController {
  constructor(private service: UserMoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(GetUserMoviesResponse)
  async getUserMovies(
    @Req() req: FastifyRequestJwtAccess,
    @Query() query: GetUserMoviesQueryDto,
  ): Promise<GetUserMoviesResponse> {
    return this.service.getUserMovies(req.user.userId, query);
  }

  @Post(':movieId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  async upsertWatched(
    @Req() req: FastifyRequestJwtAccess,
    @Param() params: UpsertUserMovieParamsDto,
    @Body() body: UpsertUserMovieBodyDto,
  ): Promise<void> {
    await this.service.upsertWatched(req.user.userId, params, body);
  }

  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  async deleteWatched(
    @Req() req: FastifyRequestJwtAccess,
    @Param() params: DeleteUserMovieParamsDto,
  ): Promise<void> {
    await this.service.deleteWatched(req.user.userId, params);
  }
}
