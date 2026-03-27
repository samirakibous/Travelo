import { IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  conversationId!: string;

  @IsString()
  @MaxLength(2000)
  content!: string;
}
