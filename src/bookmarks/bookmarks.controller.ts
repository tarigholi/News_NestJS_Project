import { Controller, Post, Delete, Get, Param, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('bookmarks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post(':newsId/toggle')
  toggle(@Param('newsId', ParseIntPipe) newsId: number, @Req() req) {
    return this.bookmarksService.toggle(req.user.id, newsId);
  }

  @Get()
  getUserBookmarks(@Req() req) {
    return this.bookmarksService.findUserBookmarks(req.user.id);
  }

  @Delete(':newsId')
  remove(@Param('newsId', ParseIntPipe) newsId: number, @Req() req) {
    return this.bookmarksService.removeBookmark(req.user.id, newsId);
  }
}
