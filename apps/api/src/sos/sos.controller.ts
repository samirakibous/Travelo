import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { SosService } from './sos.service';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('SOS')
@Controller('sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @ApiOperation({ summary: "Obtenir les numéros d'urgence" })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Code pays (ex: FR)',
  })
  @ApiResponse({ status: 200, description: "Numéros d'urgence" })
  @Get('numbers')
  getEmergencyNumbers(@Query('country') country?: string) {
    return this.sosService.getEmergencyNumbers(country);
  }

  @ApiOperation({ summary: 'Lister les pays disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des pays' })
  @Get('countries')
  getCountries() {
    return this.sosService.getAllCountries();
  }

  @ApiOperation({ summary: "Mes contacts d'urgence" })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: "Liste des contacts d'urgence" })
  @Get('contacts')
  @UseGuards(JwtAuthGuard)
  getContacts(@Request() req: AuthRequest) {
    return this.sosService.getContacts(req.user.id);
  }

  @ApiOperation({ summary: "Ajouter un contact d'urgence" })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 201, description: 'Contact créé' })
  @Post('contacts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createContact(
    @Request() req: AuthRequest,
    @Body() dto: CreateEmergencyContactDto,
  ) {
    return this.sosService.createContact(req.user.id, dto);
  }

  @ApiOperation({ summary: "Modifier un contact d'urgence" })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Contact mis à jour' })
  @Patch('contacts/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateContact(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: Partial<CreateEmergencyContactDto>,
  ) {
    return this.sosService.updateContact(id, req.user.id, dto);
  }

  @ApiOperation({ summary: "Supprimer un contact d'urgence" })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Contact supprimé' })
  @Delete('contacts/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteContact(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.sosService.deleteContact(id, req.user.id);
  }
}
