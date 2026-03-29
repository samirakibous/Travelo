import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest extends ExpressRequest {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    isActive: boolean;
    profilePicture: string | null;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Créer un compte' })
  @ApiResponse({ status: 201, description: 'Compte créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Se connecter' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie, retourne les tokens JWT',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: "Rafraîchir le token d'accès" })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string' },
        refreshToken: { type: 'string' },
      },
      required: ['userId', 'refreshToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Nouveaux tokens retournés' })
  @ApiResponse({ status: 401, description: 'Refresh token invalide ou expiré' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    const { userId, refreshToken } = body;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiOperation({ summary: 'Se déconnecter' })
  @ApiBody({
    schema: {
      properties: { userId: { type: 'string' } },
      required: ['userId'],
    },
  })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Body() body: { userId: string }) {
    const { userId } = body;
    return this.authService.logout(userId);
  }

  @ApiOperation({ summary: "Obtenir l'utilisateur connecté" })
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 200,
    description: "Informations de l'utilisateur connecté",
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
