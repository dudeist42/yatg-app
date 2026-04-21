import { TGetMeResponse } from '@yatg-app/api-types';
import { MeEntity } from '../entities/me.entity';

export class GetMeResponse implements TGetMeResponse {
  data!: MeEntity;
}
