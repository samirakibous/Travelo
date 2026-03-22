import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
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

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  specialties!: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages!: string[];

  @IsEnum(ExpertiseLevel)
  expertiseLevel!: ExpertiseLevel;
}
