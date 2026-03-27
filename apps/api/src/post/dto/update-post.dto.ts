import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ example: 'Mon voyage à Paris', description: 'Titre du post (max 100 car.)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({ example: 'Une expérience inoubliable...', description: 'Description (max 1000 car.)' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'Paris, France', description: 'Destination' })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({ example: '64b8f1e2c3d4e5f6a7b8c9d0', description: 'ID MongoDB de la catégorie' })
  @IsOptional()
  @IsMongoId()
  category?: string;
}
