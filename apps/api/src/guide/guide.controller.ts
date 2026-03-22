import {
  Body,
  Controller,
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
import { GuideService } from './guide.service';
import { CreateGuideProfileDto } from './dto/create-guide-profile.dto';
import { QueryGuideDto } from './dto/query-guide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('guides')
export class GuideController {
  constructor(private readonly guideService: GuideService) {}

  @Get()
  findAll(@Query() query: QueryGuideDto) {
    return this.guideService.findAll(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req: AuthRequest) {
    return this.guideService.getMyProfile(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guideService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  createProfile(@Request() req: AuthRequest, @Body() dto: CreateGuideProfileDto) {
    return this.guideService.createProfile(req.user.id, req.user.role, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  updateProfile(@Request() req: AuthRequest, @Body() dto: Partial<CreateGuideProfileDto>) {
    return this.guideService.updateProfile(req.user.id, dto);
  }
}
