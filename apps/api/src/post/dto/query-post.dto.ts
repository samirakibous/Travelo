import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsMongoId, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryPostDto {
  @ApiPropertyOptional({ example: 'Paris', description: 'Filtrer par destination' })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiPropertyOptional({ example: '64b8f1e2c3d4e5f6a7b8c9d0', description: 'Filtrer par catégorie (ID MongoDB)' })
  @IsOptional()
  @IsMongoId()
  category?: string;

  @ApiPropertyOptional({ enum: ['recent', 'popular'], description: 'Tri des résultats' })
  @IsOptional()
  @IsIn(['recent', 'popular'])
  sort?: 'recent' | 'popular';

  @ApiPropertyOptional({ example: '1', description: 'Numéro de page' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Nombre de résultats par page' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
