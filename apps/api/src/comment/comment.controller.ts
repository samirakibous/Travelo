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
import { Request as ExpressRequest } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(postId);
  }

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

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('commentId') commentId: string, @Request() req: AuthRequest) {
    return this.commentService.remove(commentId, req.user.id, req.user.role);
  }
}
