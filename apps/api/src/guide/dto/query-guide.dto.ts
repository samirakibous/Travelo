import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ExpertiseLevel } from '../enums/expertise-level.enum';

export class QueryGuideDto {
  @ApiPropertyOptional({ example: 'Paris', description: 'Filtrer par localisation' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: ExpertiseLevel, description: 'Niveau d\'expertise' })
  @IsOptional()
  @IsEnum(ExpertiseLevel)
  expertiseLevel?: ExpertiseLevel;

  @ApiPropertyOptional({ example: '64b8f1e2c3d4e5f6a7b8c9d0', description: 'Filtrer par spécialité (ID MongoDB)' })
  @IsOptional()
  @IsMongoId()
  specialty?: string;

  @ApiPropertyOptional({ example: 'fr', description: 'Filtrer par langue' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ example: '50', description: 'Tarif horaire minimum' })
  @IsOptional()
  @IsNumberString()
  minRate?: string;

  @ApiPropertyOptional({ example: '200', description: 'Tarif horaire maximum' })
  @IsOptional()
  @IsNumberString()
  maxRate?: string;

  @ApiPropertyOptional({ example: '1', description: 'Numéro de page' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Nombre de résultats par page' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
