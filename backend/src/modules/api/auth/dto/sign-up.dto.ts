import { IsString, Length } from 'class-validator';
import { IsPasswordNotPwned } from '../../../password-pwnd/constraints/password-pwned.constraint';
import { UsernameNotExist } from '../../../users/constraints/username-not-exist.constraint';

export class SignUpDto {
  @IsString()
  @Length(5, 100)
  @UsernameNotExist()
  username!: string;

  @IsString()
  @Length(12, 64)
  @IsPasswordNotPwned()
  password!: string;
}

export class SignUpResponseDto {
  accessToken!: string;
  expiresAt!: Date;
}
