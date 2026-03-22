import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { SafeZoneService } from './safety-zone.service';
import { CreateSafeZoneDto } from './dto/create-safety-zone.dto';
import { QuerySafeZoneDto } from './dto/query-safety-zone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('safety-zones')
export class SafeZoneController {
  constructor(private readonly safeZoneService: SafeZoneService) {}

  @Get()
  findAll(@Query() query: QuerySafeZoneDto) {
    return this.safeZoneService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.safeZoneService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateSafeZoneDto) {
    return this.safeZoneService.create(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.safeZoneService.remove(id);
  }
}
