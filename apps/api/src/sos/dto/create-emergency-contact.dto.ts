import { IsString, IsOptional } from 'class-validator';

export class CreateEmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  relationship?: string;
}
