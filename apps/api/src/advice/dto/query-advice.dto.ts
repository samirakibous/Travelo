import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class QueryAdviceDto {
  @ApiPropertyOptional({ example: 'safety,health', description: 'Catégories séparées par virgule' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['true', 'false'], description: 'Filtrer les guides certifiés uniquement' })
  @IsOptional()
  @IsEnum(['true', 'false'])
  certifiedOnly?: string;

  @ApiPropertyOptional({ example: '64b8f1e2c3d4e5f6a7b8c9d0', description: 'Filtrer par auteur (ID)' })
  @IsOptional()
  @IsString()
  authorId?: string;

  @ApiPropertyOptional({ example: 'danger,prudence', description: 'Types d\'alerte séparés par virgule' })
  @IsOptional()
  @IsString()
  adviceType?: string;
}
