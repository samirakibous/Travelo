import { IsString, MaxLength } from 'class-validator';

export class SendMessageRestDto {
  @IsString()
  @MaxLength(2000)
  content!: string;
}
