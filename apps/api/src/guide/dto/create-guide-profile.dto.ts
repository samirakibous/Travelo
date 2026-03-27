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
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  bio!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsNumber()
  @Min(0)
  hourlyRate!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsExperience?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tripsCompleted?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableDates?: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  specialties!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages!: string[];

  @IsEnum(ExpertiseLevel)
  expertiseLevel!: ExpertiseLevel;
}
