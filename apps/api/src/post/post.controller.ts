import {
  BadRequestException,
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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryPostDto } from './dto/query-post.dto';
import { VotePostDto } from './dto/vote-post.dto';
import { ReportPostDto } from './dto/report-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

const mediaStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = join(process.cwd(), 'uploads', 'posts');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const ALLOWED_MIMETYPES = /^(image\/(jpeg|png|webp)|video\/(mp4|quicktime|webm))$/;

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({ summary: 'Lister les publications' })
  @ApiResponse({ status: 200, description: 'Liste paginée des publications' })
  @Get()
  findAll(@Query() query: QueryPostDto) {
    return this.postService.findAll(query);
  }

  @ApiOperation({ summary: 'Créer une publication' })
  @ApiBearerAuth('JWT')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, destination: { type: 'string' }, category: { type: 'string' }, media: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @ApiResponse({ status: 201, description: 'Publication créée' })
  @ApiResponse({ status: 401, description: 'Non authentifié' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    FilesInterceptor('media', 5, {
      storage: mediaStorage,
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(ALLOWED_MIMETYPES)) {
          return cb(new BadRequestException('Format non supporté (JPEG, PNG, WebP, MP4, WebM)'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async create(
    @Body() createPostDto: CreatePostDto,
    @Request() req: AuthRequest,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const mediaUrls = (files ?? []).map((f) => `/uploads/posts/${f.filename}`);
    return this.postService.create(createPostDto, req.user.id, mediaUrls);
  }

  @ApiOperation({ summary: 'Modifier une publication' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Publication mise à jour' })
  @ApiResponse({ status: 403, description: 'Non autorisé' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Request() req: AuthRequest,
  ) {
    return this.postService.update(id, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Supprimer une publication' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Publication supprimée' })
  @ApiResponse({ status: 403, description: 'Non autorisé' })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.postService.remove(id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Voter pour une publication' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Vote enregistré' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  @HttpCode(HttpStatus.OK)
  vote(@Param('id') id: string, @Body() dto: VotePostDto, @Request() req: AuthRequest) {
    return this.postService.vote(id, req.user.id, dto.type);
  }

  @ApiOperation({ summary: 'Signaler une publication' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Signalement enregistré' })
  @UseGuards(JwtAuthGuard)
  @Post(':id/report')
  @HttpCode(HttpStatus.OK)
  report(@Param('id') id: string, @Body() dto: ReportPostDto, @Request() req: AuthRequest) {
    return this.postService.report(id, req.user.id, dto.reason);
  }
}
