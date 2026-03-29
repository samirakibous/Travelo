import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Comments')
@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: 'Lister les commentaires d\'un post' })
  @ApiResponse({ status: 200, description: 'Liste des commentaires' })
  @Get()
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

  @ApiOperation({ summary: 'Commenter un post' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 201, description: 'Commentaire créé' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
    @Request() req: AuthRequest,
  ) {
    return this.commentService.create(postId, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Supprimer un commentaire' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Commentaire supprimé' })
  @ApiResponse({ status: 403, description: 'Non autorisé' })
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('commentId') commentId: string, @Request() req: AuthRequest) {
    return this.commentService.remove(commentId, req.user.id, req.user.role);
  }
}
