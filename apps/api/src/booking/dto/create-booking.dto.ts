import { IsString, IsNotEmpty, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'Format de date invalide (YYYY-MM-DD)' })
  date!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
