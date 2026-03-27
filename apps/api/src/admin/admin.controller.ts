import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Statistiques admin globales' })
  @ApiResponse({ status: 200, description: 'Statistiques complètes' })
  @ApiResponse({ status: 403, description: 'Accès refusé' })
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @ApiOperation({ summary: 'Lister les utilisateurs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Liste paginée des utilisateurs' })
  @Get('users')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(page, limit, search);
  }

  @ApiOperation({ summary: 'Modifier le rôle d\'un utilisateur' })
  @ApiResponse({ status: 200, description: 'Rôle mis à jour' })
  @Patch('users/:id/role')
  updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
    return this.adminService.updateUserRole(id, role);
  }

  @ApiOperation({ summary: 'Activer/désactiver un utilisateur' })
  @ApiResponse({ status: 200, description: 'Statut basculé' })
  @Patch('users/:id/toggle-active')
  toggleUserActive(@Param('id') id: string) {
    return this.adminService.toggleUserActive(id);
  }

  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé' })
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Lister les publications (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste paginée des publications' })
  @Get('posts')
  getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getPosts(page, limit);
  }

  @ApiOperation({ summary: 'Supprimer une publication (admin)' })
  @ApiResponse({ status: 200, description: 'Publication supprimée' })
  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.adminService.deletePost(id);
  }

  @ApiOperation({ summary: 'Lister les conseils (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste paginée des conseils' })
  @Get('advices')
  getAdvices(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getAdvices(page, limit);
  }

  @ApiOperation({ summary: 'Supprimer un conseil (admin)' })
  @ApiResponse({ status: 200, description: 'Conseil supprimé' })
  @Delete('advices/:id')
  deleteAdvice(@Param('id') id: string) {
    return this.adminService.deleteAdvice(id);
  }

  @ApiOperation({ summary: 'Lister les avis (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste paginée des avis' })
  @Get('reviews')
  getReviews(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.adminService.getReviews(page, limit);
  }

  @ApiOperation({ summary: 'Supprimer un avis (admin)' })
  @ApiResponse({ status: 200, description: 'Avis supprimé' })
  @Delete('reviews/:id')
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }
}
