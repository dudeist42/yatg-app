import { TSignInBodyDto } from '@yatg-app/api-types';
import { IsString } from 'class-validator';

export class SignInBodyDto implements TSignInBodyDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
