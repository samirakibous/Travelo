import { IsString, IsEnum, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdviceDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsEnum(['safety', 'health', 'transport', 'culture', 'emergency'])
  category!: 'safety' | 'health' | 'transport' | 'culture' | 'emergency';

  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng!: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(['danger', 'prudence', 'recommandation'])
  adviceType?: 'danger' | 'prudence' | 'recommandation';

  @IsOptional()
  @IsString()
  linkedZone?: string;
}
