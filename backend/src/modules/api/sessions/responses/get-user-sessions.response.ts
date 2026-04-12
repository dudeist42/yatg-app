import { PaginatedResponse } from '../../../../common/pagination/pagination.response';
import { UserSession } from '../entities/user-session.entity';

export class GetUserSessionsResponse extends PaginatedResponse<UserSession> {}
