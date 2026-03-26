import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageRestDto } from './dto/send-message-rest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('unread-count')
  getUnreadCount(@Request() req: AuthRequest) {
    return this.messagingService.getUnreadCount(req.user.id);
  }

  @Get('conversations')
  getConversations(@Request() req: AuthRequest) {
    return this.messagingService.getConversations(req.user.id);
  }

  @Post('conversations')
  @HttpCode(HttpStatus.OK)
  findOrCreate(
    @Request() req: AuthRequest,
    @Body() dto: CreateConversationDto,
  ) {
    return this.messagingService.findOrCreate(req.user.id, dto.participantId);
  }

  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.messagingService.getMessages(id, req.user.id);
  }

  @Post('conversations/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  sendMessage(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: SendMessageRestDto,
  ) {
    return this.messagingService.sendMessage(id, req.user.id, dto.content);
  }

  @Patch('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  markAsRead(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.messagingService.markAsRead(id, req.user.id);
  }
}
