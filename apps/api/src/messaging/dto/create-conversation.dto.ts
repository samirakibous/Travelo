import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({
    example: '64b8f1e2c3d4e5f6a7b8c9d0',
    description: "ID de l'utilisateur avec qui démarrer la conversation",
  })
  @IsString()
  participantId!: string;
}
