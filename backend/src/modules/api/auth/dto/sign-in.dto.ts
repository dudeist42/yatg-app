import { TSignInBodyDto } from '@yatg-app/api-types';
import { IsString, Length, MinLength } from 'class-validator';

export class SignInBodyDto implements TSignInBodyDto {
  @IsString()
  @Length(5, 100)
  username!: string;

  @IsString()
  @MinLength(12)
  password!: string;
}
