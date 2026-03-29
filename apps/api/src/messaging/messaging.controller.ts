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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageRestDto } from './dto/send-message-rest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Messaging')
@ApiBearerAuth('JWT')
@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @ApiOperation({ summary: 'Nombre de messages non lus' })
  @ApiResponse({ status: 200, description: 'Compteur de messages non lus' })
  @Get('unread-count')
  getUnreadCount(@Request() req: AuthRequest) {
    return this.messagingService.getUnreadCount(req.user.id);
  }

  @ApiOperation({ summary: 'Lister mes conversations' })
  @ApiResponse({ status: 200, description: 'Liste des conversations' })
  @Get('conversations')
  getConversations(@Request() req: AuthRequest) {
    return this.messagingService.getConversations(req.user.id);
  }

  @ApiOperation({ summary: 'Démarrer ou retrouver une conversation' })
  @ApiResponse({ status: 200, description: 'Conversation trouvée ou créée' })
  @Post('conversations')
  @HttpCode(HttpStatus.OK)
  findOrCreate(
    @Request() req: AuthRequest,
    @Body() dto: CreateConversationDto,
  ) {
    return this.messagingService.findOrCreate(req.user.id, dto.participantId);
  }

  @ApiOperation({ summary: "Lire les messages d'une conversation" })
  @ApiResponse({ status: 200, description: 'Messages de la conversation' })
  @Get('conversations/:id/messages')
  getMessages(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.messagingService.getMessages(id, req.user.id);
  }

  @ApiOperation({ summary: 'Envoyer un message' })
  @ApiResponse({ status: 201, description: 'Message envoyé' })
  @Post('conversations/:id/messages')
  @HttpCode(HttpStatus.CREATED)
  sendMessage(
    @Param('id') id: string,
    @Request() req: AuthRequest,
    @Body() dto: SendMessageRestDto,
  ) {
    return this.messagingService.sendMessage(id, req.user.id, dto.content);
  }

  @ApiOperation({ summary: 'Marquer une conversation comme lue' })
  @ApiResponse({ status: 200, description: 'Conversation marquée comme lue' })
  @Patch('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  markAsRead(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.messagingService.markAsRead(id, req.user.id);
  }
}
