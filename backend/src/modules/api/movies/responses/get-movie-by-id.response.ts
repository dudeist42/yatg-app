import { TResponse } from '@yatg-app/api-types';
import { DetailedMovie } from '../entities/detailed-movie.entity';

export class GetMovieByIdResponse implements TResponse<DetailedMovie> {
  data!: DetailedMovie;
}
