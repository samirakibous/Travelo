import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SafeZoneService } from './safety-zone.service';
import { CreateSafeZoneDto } from './dto/create-safety-zone.dto';
import { QuerySafeZoneDto } from './dto/query-safety-zone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Safety Zones')
@Controller('safety-zones')
export class SafeZoneController {
  constructor(private readonly safeZoneService: SafeZoneService) {}

  @ApiOperation({ summary: 'Lister les zones de sécurité' })
  @ApiResponse({ status: 200, description: 'Liste des zones' })
  @Get()
  findAll(@Query() query: QuerySafeZoneDto) {
    return this.safeZoneService.findAll(query);
  }

  @ApiOperation({ summary: 'Obtenir une zone par ID' })
  @ApiResponse({ status: 200, description: 'Détail de la zone' })
  @ApiResponse({ status: 404, description: 'Zone non trouvée' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.safeZoneService.findOne(id);
  }

  @ApiOperation({ summary: 'Créer une zone (admin)' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 201, description: 'Zone créée' })
  @ApiResponse({ status: 403, description: 'Rôle admin requis' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSafeZoneDto) {
    return this.safeZoneService.create(dto);
  }

  @ApiOperation({ summary: 'Supprimer une zone (admin)' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Zone supprimée' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.safeZoneService.remove(id);
  }
}
