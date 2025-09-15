import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { NewsService } from '../news/news.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarksRepository: Repository<Bookmark>,
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
  ) {}

  async addBookmark(userId: number, newsId: number) {
    const user = await this.usersService.findOne(userId);
    
    if (!user) throw new NotFoundException('User not found');

    const news = await this.newsService.findOneById(newsId);
    if (!news) throw new NotFoundException('News not found');

    const bookmark = this.bookmarksRepository.create({ user, news });
    return this.bookmarksRepository.save(bookmark);
  }

  async removeBookmark(userId: number, newsId: number) {
    const bookmark = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, news: { id: newsId } },
    });
    if (!bookmark) throw new NotFoundException('Bookmark not found');
    return this.bookmarksRepository.remove(bookmark);
  }

  async findUserBookmarks(userId: number) {
    return this.bookmarksRepository.find({
      where: { user: { id: userId } },
      relations: ['news'],
    });
  }
  async toggle(userId: number, newsId: number) {
  const existing = await this.bookmarksRepository.findOne({
    where: { user: { id: userId }, news: { id: newsId } },
  });

  if (existing) {
    await this.bookmarksRepository.remove(existing);
    return { message: 'Bookmark removed' };
  } else {
    const user = await this.usersService.findOne(userId);
    
    if (!user) throw new NotFoundException('User not found');

    const news = await this.newsService.findOneById(newsId);
    if (!news) throw new NotFoundException('News not found');

    const bookmark = this.bookmarksRepository.create({ user, news });
    return this.bookmarksRepository.save(bookmark);
  }
}
}
