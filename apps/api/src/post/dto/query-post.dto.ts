import { IsIn, IsMongoId, IsNumberString, IsOptional, IsString } from 'class-validator';

export class QueryPostDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsIn(['recent', 'popular'])
  sort?: 'recent' | 'popular';

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
