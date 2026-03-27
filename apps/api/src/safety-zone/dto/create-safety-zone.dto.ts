import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
  @ApiProperty({ example: 48.8566, description: 'Latitude' })
  @IsNumber()
  lat!: number;

  @ApiProperty({ example: 2.3522, description: 'Longitude' })
  @IsNumber()
  lng!: number;
}

export class CreateSafeZoneDto {
  @ApiProperty({ example: 'Montmartre', description: 'Nom de la zone' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Zone touristique fréquentée', description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ['safe', 'caution', 'danger'], description: 'Niveau de risque' })
  @IsEnum(['safe', 'caution', 'danger'])
  riskLevel!: 'safe' | 'caution' | 'danger';

  @ApiProperty({ enum: ['tourist', 'transport', 'accommodation', 'food', 'general'], description: 'Catégorie' })
  @IsEnum(['tourist', 'transport', 'accommodation', 'food', 'general'])
  category!: 'tourist' | 'transport' | 'accommodation' | 'food' | 'general';

  @ApiProperty({ enum: ['point', 'polygon'], description: 'Type de géométrie' })
  @IsEnum(['point', 'polygon'])
  type!: 'point' | 'polygon';

  @ApiPropertyOptional({ example: 48.8566, description: 'Latitude (pour type point)' })
  @IsOptional()
  @IsNumber()
  lat?: number;

  @ApiPropertyOptional({ example: 2.3522, description: 'Longitude (pour type point)' })
  @IsOptional()
  @IsNumber()
  lng?: number;

  @ApiPropertyOptional({ type: [CoordinateDto], description: 'Coordonnées (pour type polygon)' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates?: CoordinateDto[];

  @ApiPropertyOptional({ example: true, description: 'Actif de jour' })
  @IsOptional()
  @IsBoolean()
  activeDay?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Actif de nuit' })
  @IsOptional()
  @IsBoolean()
  activeNight?: boolean;
}
