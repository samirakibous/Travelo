import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class QuerySafeZoneDto {
  @ApiPropertyOptional({ example: 'danger', description: 'Filtrer par niveau de risque (safe, caution, danger)' })
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @ApiPropertyOptional({ example: 'tourist', description: 'Filtrer par catégorie (tourist, transport, accommodation, food, general)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['day', 'night', 'all'], description: 'Filtrer par période' })
  @IsOptional()
  @IsEnum(['day', 'night', 'all'])
  time?: 'day' | 'night' | 'all';
}
