import { TSessionEntity } from '@yatg-app/api-types';

export class SessionEntity implements TSessionEntity {
  id!: string;
  createdAt!: Date;
  lastUsedAt!: Date;
}
