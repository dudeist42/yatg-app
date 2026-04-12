import { PaginatedResponse } from '../../../../common/pagination/pagination.response';
import { UserMovieItem } from '../entities/user-movie.entity';

export class GetUserMoviesResponse extends PaginatedResponse<UserMovieItem> {}
