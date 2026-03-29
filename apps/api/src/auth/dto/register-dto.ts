import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Adresse email' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password1!',
    description: 'Mot de passe (min 8 car., 1 majuscule, 1 chiffre, 1 spécial)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/[A-Z]/, {
    message: 'Le mot de passe doit contenir au moins une majuscule',
  })
  @Matches(/[0-9]/, {
    message: 'Le mot de passe doit contenir au moins un chiffre',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Le mot de passe doit contenir au moins un caractère spécial',
  })
  password!: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom de famille' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ enum: Role, description: "Rôle de l'utilisateur" })
  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of: ${Object.values(Role).join(', ')}`,
  })
  role?: Role;
}
