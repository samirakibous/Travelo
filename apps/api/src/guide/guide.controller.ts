import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { GuideService } from './guide.service';
import { CreateGuideProfileDto } from './dto/create-guide-profile.dto';
import { QueryGuideDto } from './dto/query-guide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Guides')
@Controller('guides')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @ApiOperation({ summary: 'Lister les guides' })
  @ApiResponse({ status: 200, description: 'Liste paginée des guides' })
  @Get()
  findAll(@Query() query: QueryGuideDto) {
    return this.guideService.findAll(query);
  }

  @ApiOperation({ summary: 'Obtenir mon profil guide' })
  @ApiBearerAuth('JWT')
  @ApiResponse({
    status: 200,
    description: "Profil guide de l'utilisateur connecté",
  })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req: AuthRequest) {
    return this.guideService.getMyProfile(req.user.id);
  }

  @ApiOperation({ summary: 'Obtenir un guide par ID' })
  @ApiResponse({ status: 200, description: 'Profil guide' })
  @ApiResponse({ status: 404, description: 'Guide non trouvé' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guideService.findOne(id);
  }

  @ApiOperation({ summary: 'Créer un profil guide' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 201, description: 'Profil guide créé' })
  @ApiResponse({ status: 403, description: 'Rôle insuffisant' })
  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  createProfile(
    @Request() req: AuthRequest,
    @Body() dto: CreateGuideProfileDto,
  ) {
    return this.guideService.createProfile(req.user.id, req.user.role, dto);
  }

  @ApiOperation({ summary: 'Mettre à jour mon profil guide' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Profil guide mis à jour' })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @Request() req: AuthRequest,
    @Body() dto: Partial<CreateGuideProfileDto>,
  ) {
    return this.guideService.updateProfile(req.user.id, dto);
  }
}
