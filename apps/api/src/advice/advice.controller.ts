import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { AdviceService } from './advice.service';
import { CreateAdviceDto } from './dto/create-advice.dto';
import { QueryAdviceDto } from './dto/query-advice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

const mediaStorage = diskStorage({
  destination: (_req, _file, cb) => {
    const dir = join(process.cwd(), 'uploads', 'advice');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const ALLOWED_MIMETYPES = /^(image\/(jpeg|png|webp)|video\/(mp4|quicktime|webm))$/;

@Controller('advices')
export class AdviceController {
  constructor(private readonly adviceService: AdviceService) {}

  @Get()
  findAll(@Query() query: QueryAdviceDto) {
    return this.adviceService.findAll(query);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  findMine(@Request() req: AuthRequest) {
    return this.adviceService.findByAuthor(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adviceService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.GUIDE)
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
      limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
    }),
  )
  async create(
    @Request() req: AuthRequest,
    @Body() dto: CreateAdviceDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const mediaUrls = (files ?? []).map((f) => `/uploads/advice/${f.filename}`);
    return this.adviceService.create(req.user.id, dto, mediaUrls);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Request() req: AuthRequest) {
    return this.adviceService.remove(id, req.user.id, req.user.role);
  }
}
