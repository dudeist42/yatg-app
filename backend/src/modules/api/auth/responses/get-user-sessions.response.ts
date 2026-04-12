import { UserSession } from '../entities/user-session.entity';

export class GetUserSessionsResponse {
  data!: {
    sessions: UserSession[];
  };
}
