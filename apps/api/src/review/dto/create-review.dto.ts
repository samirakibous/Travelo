import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  Min,
  Max,
  MaxLength,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    minimum: 1,
    maximum: 5,
    description: 'Note de 1 à 5',
  })
  @IsInt()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  rating!: number;

  @ApiProperty({
    example: 'Excellent guide, très professionnel!',
    description: 'Commentaire (max 1000 car.)',
  })
  @IsString()
  @MaxLength(1000)
  comment!: string;

  @ApiPropertyOptional({
    example: ['/uploads/reviews/photo1.jpg'],
    description: 'URLs des photos',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
