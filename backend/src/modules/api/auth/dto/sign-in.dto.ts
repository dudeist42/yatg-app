import { IsString, Length, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @Length(5, 100)
  username!: string;

  @IsString()
  @MinLength(12)
  password!: string;
}
