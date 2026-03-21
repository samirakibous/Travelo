import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PostCategory } from '../enums/post-category.enum';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsEnum(PostCategory)
  category?: PostCategory;
}
