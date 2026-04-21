import { TDeleteSessionParamsDto } from '@yatg-app/api-types';
import { IsString } from 'class-validator';

export class DeleteSessionParamsDto implements TDeleteSessionParamsDto {
  @IsString()
  sessionId!: string;
}
