import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { VotePostDto } from './dto/vote-post.dto';
import { ReportPostDto } from './dto/report-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; _id: string; role: string };
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto, @Request() req: AuthRequest) {
    return this.postService.create(createPostDto, req.user._id ?? req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Request() req: AuthRequest,
  ) {
    return this.postService.update(id, req.user._id ?? req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.postService.remove(id, req.user._id ?? req.user.id, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  vote(@Param('id') id: string, @Body() dto: VotePostDto, @Request() req: AuthRequest) {
    return this.postService.vote(id, req.user._id ?? req.user.id, dto.type);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/report')
  @HttpCode(HttpStatus.OK)
  report(@Param('id') id: string, @Body() dto: ReportPostDto, @Request() req: AuthRequest) {
    return this.postService.report(id, req.user._id ?? req.user.id, dto.reason);
  }
}
