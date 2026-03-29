import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ExpertiseLevel } from '../enums/expertise-level.enum';

export class CreateGuideProfileDto {
  @ApiProperty({
    example: "Guide passionné avec 10 ans d'expérience...",
    description: 'Biographie (max 500 car.)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  bio!: string;

  @ApiProperty({
    example: 'Paris, France',
    description: 'Localisation principale',
  })
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiProperty({ example: 80, description: 'Tarif horaire en euros' })
  @IsNumber()
  @Min(0)
  hourlyRate!: number;

  @ApiPropertyOptional({ example: 10, description: "Années d'expérience" })
  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsExperience?: number;

  @ApiPropertyOptional({
    example: 150,
    description: 'Nombre de voyages effectués',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tripsCompleted?: number;

  @ApiProperty({
    example: ['64b8f1e2c3d4e5f6a7b8c9d0'],
    description: 'IDs MongoDB des spécialités',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  specialties!: string[];

  @ApiProperty({ example: ['fr', 'en', 'es'], description: 'Langues parlées' })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages!: string[];

  @ApiProperty({ enum: ExpertiseLevel, description: "Niveau d'expertise" })
  @IsEnum(ExpertiseLevel)
  expertiseLevel!: ExpertiseLevel;
}
