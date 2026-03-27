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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@Controller('guides/:guideId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  findAll(@Param('guideId') guideId: string) {
    return this.reviewService.findByGuide(guideId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('guideId') guideId: string,
    @Request() req: AuthRequest,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.create(req.user.id, req.user.role, guideId, dto);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('reviewId') reviewId: string, @Request() req: AuthRequest) {
    return this.reviewService.remove(reviewId, req.user.id, req.user.role);
  }
}
