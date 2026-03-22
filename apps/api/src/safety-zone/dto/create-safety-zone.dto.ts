import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
  @IsNumber()
  lat!: number;

  @IsNumber()
  lng!: number;
}

export class CreateSafeZoneDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['safe', 'caution', 'danger'])
  riskLevel!: 'safe' | 'caution' | 'danger';

  @IsEnum(['tourist', 'transport', 'accommodation', 'food', 'general'])
  category!: 'tourist' | 'transport' | 'accommodation' | 'food' | 'general';

  @IsEnum(['point', 'polygon'])
  type!: 'point' | 'polygon';

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates?: CoordinateDto[];

  @IsOptional()
  @IsBoolean()
  activeDay?: boolean;

  @IsOptional()
  @IsBoolean()
  activeNight?: boolean;
}
