import { IsString, Length } from 'class-validator';
import { IsPasswordNotPwned } from '../../../password-pwnd/constraints/password-pwned.constraint';
import { UsernameNotExist } from '../../../users/constraints/username-not-exist.constraint';
import { TSignUpBodyDto } from '@yatg-app/api-types';

export class SignUpBodyDto implements TSignUpBodyDto {
  @IsString()
  @Length(5, 100)
  @UsernameNotExist()
  username!: string;

  @IsString()
  @Length(12, 64)
  @IsPasswordNotPwned()
  password!: string;
}
