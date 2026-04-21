import { TMeEntity } from '@yatg-app/api-types';

export class MeEntity implements TMeEntity {
  id!: string;
  username!: string;
  sessionId!: string;
}
