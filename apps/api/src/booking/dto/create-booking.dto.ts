import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({
    example: '2024-08-15',
    description: 'Date de la réservation (format YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Format de date invalide (YYYY-MM-DD)',
  })
  date!: string;

  @ApiPropertyOptional({
    example: 'Je souhaite visiter le Louvre et les Tuileries.',
    description: 'Message pour le guide (max 500 car.)',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
