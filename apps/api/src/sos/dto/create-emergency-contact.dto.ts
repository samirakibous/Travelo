import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateEmergencyContactDto {
  @ApiProperty({ example: 'Marie Dupont', description: 'Nom du contact' })
  @IsString()
  name!: string;

  @ApiProperty({ example: '+33612345678', description: 'Numéro de téléphone' })
  @IsString()
  phone!: string;

  @ApiPropertyOptional({
    example: 'Famille',
    description: 'Relation avec le contact',
  })
  @IsOptional()
  @IsString()
  relationship?: string;
}
