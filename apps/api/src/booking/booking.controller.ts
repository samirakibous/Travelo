import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Bookings')
@ApiBearerAuth('JWT')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiOperation({ summary: 'Réserver un guide' })
  @ApiResponse({ status: 201, description: 'Réservation créée' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @Post('guides/:guideId')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('guideId') guideId: string,
    @Request() req: AuthRequest,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.create(req.user.id, guideId, dto);
  }

  @ApiOperation({ summary: 'Mes réservations (touriste)' })
  @ApiResponse({ status: 200, description: 'Liste de mes réservations' })
  @Get('mine')
  findMine(@Request() req: AuthRequest) {
    return this.bookingService.findByTourist(req.user.id);
  }

  @ApiOperation({ summary: 'Demandes entrantes (guide)' })
  @ApiResponse({ status: 200, description: 'Liste des demandes reçues' })
  @Get('incoming')
  findIncoming(@Request() req: AuthRequest) {
    return this.bookingService.findByGuide(req.user.id);
  }

  @ApiOperation({ summary: 'Confirmer une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation confirmée' })
  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.confirm(id, req.user.id);
  }

  @ApiOperation({ summary: 'Rejeter une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation rejetée' })
  @Patch(':id/reject')
  reject(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.reject(id, req.user.id);
  }

  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée' })
  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.cancel(id, req.user.id);
  }
}
