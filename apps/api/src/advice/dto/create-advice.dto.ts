import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';

import { Type } from 'class-transformer';

export class CreateAdviceDto {
  @ApiProperty({ example: 'Attention aux pickpockets', description: 'Titre du conseil' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Dans cette zone, soyez vigilants avec vos affaires.', description: 'Contenu détaillé' })
  @IsString()
  content!: string;

  @ApiProperty({ example: 48.8566, description: 'Latitude (-90 à 90)' })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @ApiProperty({ example: 2.3522, description: 'Longitude (-180 à 180)' })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;

  @ApiPropertyOptional({ example: 'Place de la République, Paris', description: 'Adresse textuelle' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ enum: ['danger', 'prudence', 'recommandation'], description: 'Niveau d\'alerte' })
  @IsOptional()
  @IsEnum(['danger', 'prudence', 'recommandation'])
  adviceType?: 'danger' | 'prudence' | 'recommandation';

}
