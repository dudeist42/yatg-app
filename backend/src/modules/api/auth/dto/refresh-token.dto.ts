import { TRefreshTokenBodyDto } from '@yatg-app/api-types';
import { IsString } from 'class-validator';

export class RefreshTokenBodyDto implements TRefreshTokenBodyDto {
  @IsString()
  refreshToken!: string;
}
