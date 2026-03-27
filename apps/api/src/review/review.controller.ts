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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthRequest extends ExpressRequest {
  user: { id: string; role: string };
}

@ApiTags('Reviews')
@Controller('guides/:guideId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiOperation({ summary: 'Lister les avis d\'un guide' })
  @ApiResponse({ status: 200, description: 'Liste des avis' })
  @Get()
  findAll(@Param('guideId') guideId: string) {
    return this.reviewService.findByGuide(guideId);
  }

  @ApiOperation({ summary: 'Laisser un avis sur un guide' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 201, description: 'Avis créé' })
  @ApiResponse({ status: 403, description: 'Non autorisé (doit être un touriste)' })
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

  @ApiOperation({ summary: 'Supprimer un avis' })
  @ApiBearerAuth('JWT')
  @ApiResponse({ status: 200, description: 'Avis supprimé' })
  @ApiResponse({ status: 403, description: 'Non autorisé' })
  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('reviewId') reviewId: string, @Request() req: AuthRequest) {
    return this.reviewService.remove(reviewId, req.user.id, req.user.role);
  }
}
