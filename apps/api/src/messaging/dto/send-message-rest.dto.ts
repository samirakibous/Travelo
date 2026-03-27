import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SendMessageRestDto {
  @ApiProperty({ example: 'Bonjour, êtes-vous disponible le 15 août?', description: 'Contenu du message (max 2000 car.)' })
  @IsString()
  @MaxLength(2000)
  content!: string;
}
