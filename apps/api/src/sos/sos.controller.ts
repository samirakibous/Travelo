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
import { Request as ExpressRequest } from 'express';
import { SosService } from './sos.service';
import { CreateEmergencyContactDto } from './dto/create-emergency-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('sos')
export class SosController {
  constructor(private readonly sosService: SosService) {}

  @Get('numbers')
  getEmergencyNumbers(@Query('country') country?: string) {
    return this.sosService.getEmergencyNumbers(country);
  }

  @Get('countries')
  getCountries() {
    return this.sosService.getAllCountries();
  }

  @Get('contacts')
  @UseGuards(JwtAuthGuard)
  getContacts(@Request() req: AuthRequest) {
    return this.sosService.getContacts(req.user.id);
  }

  @Post('contacts')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createContact(@Request() req: AuthRequest, @Body() dto: CreateEmergencyContactDto) {
    return this.sosService.createContact(req.user.id, dto);
  }

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

  @Delete('contacts/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  deleteContact(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.sosService.deleteContact(id, req.user.id);
  }
}
