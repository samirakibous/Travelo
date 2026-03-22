import { IsOptional, IsString, IsEnum } from 'class-validator';

export class QuerySafeZoneDto {
  @IsOptional()
  @IsString()
  riskLevel?: string;

  @IsOptional()
  @IsString()
  category?: string; 

  @IsOptional()
  @IsEnum(['day', 'night', 'all'])
  time?: 'day' | 'night' | 'all';
}
