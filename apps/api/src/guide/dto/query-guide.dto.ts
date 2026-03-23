import { IsEnum, IsMongoId, IsNumberString, IsOptional, IsString } from 'class-validator';
import { ExpertiseLevel } from '../enums/expertise-level.enum';

export class QueryGuideDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ExpertiseLevel)
  expertiseLevel?: ExpertiseLevel;

  @IsOptional()
  @IsMongoId()
  specialty?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsNumberString()
  minRate?: string;

  @IsOptional()
  @IsNumberString()
  maxRate?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
