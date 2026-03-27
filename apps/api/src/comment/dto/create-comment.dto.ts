import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Super post, merci pour le partage!', description: 'Contenu du commentaire (max 500 car.)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  content!: string;
}
