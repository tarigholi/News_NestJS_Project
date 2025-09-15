import { Controller, Post, Delete, Get, Param, Body, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateCommentDto, @Req() req) {
    return this.commentsService.create(dto, req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'reader', 'journalist')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const isAdmin = req.user.role === 'admin';
    return this.commentsService.remove(id, req.user.id, isAdmin);
  }

  @Get('news/:newsId')
  findByNews(@Param('newsId', ParseIntPipe) newsId: number) {
    return this.commentsService.findCommentsByNews(newsId);
  }
}
