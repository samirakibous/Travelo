import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { PostCategory } from '../enums/post-category.enum';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsEnum(PostCategory)
  category!: PostCategory;
}
