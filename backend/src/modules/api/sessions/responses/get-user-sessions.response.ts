import { PaginatedResponse } from '../../../../common/pagination/pagination.response';
import { SessionEntity } from '../entities/session.entity';

export class GetSessionsResponse extends PaginatedResponse<SessionEntity> {}
