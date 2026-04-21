import { TUserMovieEntity } from '@yatg-app/api-types';
import { PaginatedResponse } from '../../../../common/pagination/pagination.response';

export class GetUserMoviesResponse extends PaginatedResponse<TUserMovieEntity> {}
