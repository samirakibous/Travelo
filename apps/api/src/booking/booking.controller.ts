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
import { Request as ExpressRequest } from 'express';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Tourist creates a booking for a guide
  @Post('guides/:guideId')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('guideId') guideId: string,
    @Request() req: AuthRequest,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.create(req.user.id, guideId, dto);
  }

  // Tourist: my bookings
  @Get('mine')
  findMine(@Request() req: AuthRequest) {
    return this.bookingService.findByTourist(req.user.id);
  }

  // Guide: incoming requests
  @Get('incoming')
  findIncoming(@Request() req: AuthRequest) {
    return this.bookingService.findByGuide(req.user.id);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.confirm(id, req.user.id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.reject(id, req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.bookingService.cancel(id, req.user.id);
  }
}