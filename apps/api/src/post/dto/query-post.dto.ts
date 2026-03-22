import { IsEnum, IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PostCategory } from '../enums/post-category.enum';

export class QueryPostDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;

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
