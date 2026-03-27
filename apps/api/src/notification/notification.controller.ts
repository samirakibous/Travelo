import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @Get()
  getAll(@Request() req: AuthRequest) {
    return this.notifService.getForUser(req.user.id);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: AuthRequest) {
    return this.notifService.getUnreadCount(req.user.id);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  markAllRead(@Request() req: AuthRequest) {
    return this.notifService.markAllRead(req.user.id);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  markOneRead(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.notifService.markOneRead(id, req.user.id);
  }
}
