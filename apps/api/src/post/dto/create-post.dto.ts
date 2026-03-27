import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Mon voyage à Paris', description: 'Titre du post (max 100 car.)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @ApiProperty({ example: 'Une expérience inoubliable...', description: 'Description (max 1000 car.)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ example: 'Paris, France', description: 'Destination' })
  @IsString()
  @IsNotEmpty()
  destination!: string;

  @ApiProperty({ example: '64b8f1e2c3d4e5f6a7b8c9d0', description: 'ID MongoDB de la catégorie' })
  @IsMongoId()
  @IsNotEmpty()
  category!: string;
}
