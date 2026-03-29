import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSpecialtyDto {
  @ApiProperty({ example: 'Randonnée', description: 'Nom de la spécialité' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
