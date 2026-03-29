import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryPostDto {
  @ApiPropertyOptional({
    example: '64b8f1e2c3d4e5f6a7b8c9d0',
    description: 'Filtrer par catégorie (ID MongoDB)',
  })
  @IsOptional()
  @IsMongoId()
  category?: string;

  @ApiPropertyOptional({ example: 1, description: 'Numéro de page' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Nombre de résultats par page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
