import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Req,
  Param,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { FindMoviesQueryDto } from './dto/find-movies.dto';
import { MovieEntity } from './entities/movie.entity';
import { type FastifyRequestJwtAccess } from '../auth/strategies/jwt-access.strategy';
import { GetMovieByIdParamsDto } from './dto/get-movie-by-id.dto';
import { ApiPaginatedResponse } from '../../../common/pagination/pagination.decorator';
import { GetMovieByIdResponse } from './responses/get-movie-by-id.response';
import { PaginatedResponse } from '../../../common/pagination/pagination.response';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(MovieEntity)
  async findMovies(
    @Req() req: FastifyRequestJwtAccess,
    @Query() params: FindMoviesQueryDto,
  ): Promise<PaginatedResponse<MovieEntity>> {
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
}
