import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @ApiOperation({ summary: 'Statistiques publiques de la plateforme' })
  @ApiResponse({ status: 200, description: 'Statistiques (nb utilisateurs, guides, posts, etc.)' })
  @Get()
  getPublicStats() {
    return this.statsService.getPublicStats();
  }
}
