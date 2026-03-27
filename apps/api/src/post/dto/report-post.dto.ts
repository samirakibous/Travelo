import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ReportPostDto {
  @ApiProperty({ example: 'Contenu inapproprié', description: 'Raison du signalement (max 300 car.)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  reason!: string;
}
