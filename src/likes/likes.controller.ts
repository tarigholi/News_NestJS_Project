import { Controller, Post, Delete, Get, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':newsId/toggle')
  toggle(@Param('newsId', ParseIntPipe) newsId: number, @Req() req) {
    return this.likesService.toggle(req.user.id, newsId);
  }

  @Delete(':newsId')
  unlike(@Param('newsId', ParseIntPipe) newsId: number, @Req() req) {
    return this.likesService.unlikeNews(req.user.id, newsId);
  }

  @Get(':newsId/count')
  countLikes(@Param('newsId', ParseIntPipe) newsId: number) {
    return this.likesService.countLikes(newsId);
  }
}
