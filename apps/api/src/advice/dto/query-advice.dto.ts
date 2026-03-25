import { IsOptional, IsString, IsEnum } from 'class-validator';

export class QueryAdviceDto {
  @IsOptional()
  @IsString()
  category?: string; // comma-separated

  @IsOptional()
  @IsEnum(['true', 'false'])
  certifiedOnly?: string;

  @IsOptional()
  @IsString()
  authorId?: string;
}
