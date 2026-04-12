import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Req,
  Param,
  Body,
  Post,
  Delete,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { FindMoviesQueryDto } from './dto/find-movies.dto';
import { FindMovieItem } from './entities/find-movie.entity';
import { type FastifyRequestJwtAccess } from '../auth/strategies/jwt-access.strategy';
import { GetMovieByIdParamsDto } from './dto/get-movie-by-id.dto';
import { WatchMovieBodyDto, WatchMovieParamsDto } from './dto/watch-movie.dto';
import { ApiPaginatedResponse } from '../../../common/pagination/pagination.decorator';
import { UserMovieItem } from './entities/user-movie.entity';
import { FindUserMoviesQueryDto } from './dto/find-user-movies';
import { GetUserMoviesResponse } from './responses/find-user-movies.response';
import { GetMovieByIdResponse } from './responses/get-movie-by-id.response';
import { PaginatedResponse } from '../../../common/pagination/pagination.response';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(FindMovieItem)
  async findMovies(
    @Req() req: FastifyRequestJwtAccess,
    @Query() params: FindMoviesQueryDto,
  ): Promise<PaginatedResponse<FindMovieItem>> {
    return this.moviesService.search(req.user.userId, params);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiOkResponse({ type: GetMovieByIdResponse })
  @ApiBearerAuth('access-token')
  async getMovieById(
    @Req() req: FastifyRequestJwtAccess,
    @Param() params: GetMovieByIdParamsDto,
  ): Promise<GetMovieByIdResponse> {
    return this.moviesService.getMovieById(req.user.userId, params.id);
  }

  @Post(':id/watch')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  async watchMovie(
    @Req() req: FastifyRequestJwtAccess,
    @Param() params: WatchMovieParamsDto,
    @Body() body: WatchMovieBodyDto,
  ): Promise<void> {
    await this.moviesService.watch(req.user.userId, params.id, body);
  }

  @Delete(':id/watch')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  async unwatchMovie(
    @Req() req: FastifyRequestJwtAccess,
    @Param() params: WatchMovieParamsDto,
  ): Promise<void> {
    await this.moviesService.unwatch(req.user.userId, params.id);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(UserMovieItem)
  findUserMovies(
    @Req() req: FastifyRequestJwtAccess,
    @Query() query: FindUserMoviesQueryDto,
  ): Promise<GetUserMoviesResponse> {
    return this.moviesService.getUserMovies(
      req.user.userId,
      query.limit,
      query.page,
    );
  }
}
