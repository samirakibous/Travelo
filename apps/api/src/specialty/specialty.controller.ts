import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Specialties')
@Controller('specialties')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @ApiOperation({ summary: 'Lister les spécialités' })
  @ApiResponse({ status: 200, description: 'Liste des spécialités' })
  @Get()
  findAll() {
    return this.specialtyService.findAll();
  }

  @ApiOperation({ summary: 'Créer une spécialité (admin)' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 201, description: 'Spécialité créée' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtyService.create(dto);
  }

  @ApiOperation({ summary: 'Modifier une spécialité (admin)' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Spécialité mise à jour' })
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: Partial<CreateSpecialtyDto>) {
    return this.specialtyService.update(id, dto);
  }

  @ApiOperation({ summary: 'Supprimer une spécialité (admin)' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Spécialité supprimée' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }
}
