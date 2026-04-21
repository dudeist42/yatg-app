import { Injectable } from '@nestjs/common';
import { GetSessionsQueryDto } from './dto/get-sessions.dto';
import { SessionsRepository } from './sessions.repository';
import {
  getOffsetByPage,
  getTotalPages,
} from '../../../common/pagination/pagination.utils';

@Injectable()
export class SessionsService {
  constructor(private sessionsRepository: SessionsRepository) {}

  async findSessionsByUserId(userId: string, query: GetSessionsQueryDto) {
    const offset = getOffsetByPage(query.page, query.limit);
    const { total, data } = await this.sessionsRepository.findSessionsByUserId({
      userId,
      offset,
      limit: query.limit,
    });
    const totalPages = getTotalPages(total, query.limit);

    return {
      meta: {
        page: query.page,
        totalItems: total,
        totalPages,
      },
      data,
    };
  }

  async deleteSessionById(sessionId: string, userId: string) {
    await this.sessionsRepository.deleteSessionById(sessionId, userId);
  }

  async deleteSessionsByUserId(userId: string, excludeSessionId?: string) {
    await this.sessionsRepository.deleteSessionsByUserId(
      userId,
      excludeSessionId,
    );
  }
}
