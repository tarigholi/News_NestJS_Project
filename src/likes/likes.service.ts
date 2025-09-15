import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { NewsService } from '../news/news.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
  ) {}

  async likeNews(userId: number, newsId: number) {
    const user = await this.usersService.findOne(userId);
    
    if (!user) throw new NotFoundException('User not found');

    const news = await this.newsService.findOneById(newsId);
    if (!news) throw new NotFoundException('News not found');

    const existingLike = await this.likesRepository.findOne({
      where: { user: { id: userId }, news: { id: newsId } },
    });

    if (existingLike) return existingLike;

    const like = this.likesRepository.create({ user, news });
    return this.likesRepository.save(like);
  }

  async unlikeNews(userId: number, newsId: number) {
    const like = await this.likesRepository.findOne({
      where: { user: { id: userId }, news: { id: newsId } },
    });
    if (!like) throw new NotFoundException('Like not found');
    return this.likesRepository.remove(like);
  }

  async countLikes(newsId: number) {
    return this.likesRepository.count({
      where: { news: { id: newsId } },
    });
  }
  async toggle(userId: number, newsId: number) {
  const existing = await this.likesRepository.findOne({
    where: { user: { id: userId }, news: { id: newsId } },
  });

  if (existing) {
    await this.likesRepository.remove(existing);
    return { message: 'Like removed' };
  } else {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new NotFoundException('User not found');

    const news = await this.newsService.findOneById(newsId);
    if (!news) throw new NotFoundException('News not found');

    const like = this.likesRepository.create({ user, news });
    return this.likesRepository.save(like);
  }
}
}
