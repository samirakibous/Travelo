import { IsInt, IsString, Min, Max, MaxLength, IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating!: number;

  @IsString()
  @MaxLength(1000)
  comment!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
