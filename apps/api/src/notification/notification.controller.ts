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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Notifications')
@ApiBearerAuth('JWT')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notifService: NotificationService) {}

  @ApiOperation({ summary: 'Lister mes notifications' })
  @ApiResponse({ status: 200, description: 'Liste des notifications' })
  @Get()
  getAll(@Request() req: AuthRequest) {
    return this.notifService.getForUser(req.user.id);
  }

  @ApiOperation({ summary: 'Nombre de notifications non lues' })
  @ApiResponse({
    status: 200,
    description: 'Compteur de notifications non lues',
  })
  @Get('unread-count')
  getUnreadCount(@Request() req: AuthRequest) {
    return this.notifService.getUnreadCount(req.user.id);
  }

  @ApiOperation({ summary: 'Marquer toutes les notifications comme lues' })
  @ApiResponse({
    status: 200,
    description: 'Toutes les notifications marquées comme lues',
  })
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  markAllRead(@Request() req: AuthRequest) {
    return this.notifService.markAllRead(req.user.id);
  }

  @ApiOperation({ summary: 'Marquer une notification comme lue' })
  @ApiResponse({ status: 200, description: 'Notification marquée comme lue' })
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  markOneRead(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.notifService.markOneRead(id, req.user.id);
  }
}
