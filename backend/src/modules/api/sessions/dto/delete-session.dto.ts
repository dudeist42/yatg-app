import { IsString } from 'class-validator';

export class DeleteSessionParamsDto {
  @IsString()
  sessionId!: string;
}
