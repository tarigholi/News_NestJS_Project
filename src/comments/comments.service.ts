import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NewsService } from '../news/news.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly newsService: NewsService,
    private readonly usersService: UsersService,
  ) {}

async create(dto: CreateCommentDto, userId: number) {
  const user = await this.usersService.findOne(userId); 

  if (!user) throw new NotFoundException('User not found');

  const news = await this.newsService.findOneById(dto.newsId);
  if (!news) throw new NotFoundException('News not found');

  const comment = this.commentsRepository.create({
    content: dto.content,
    user,
    news,
  });

  return this.commentsRepository.save(comment);
}


  async remove(commentId: number, userId: number, isAdmin: boolean) {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('Comment not found');

    if (!isAdmin && comment.user.id !== userId) {
      throw new ForbiddenException('Not allowed to delete this comment');
    }

    return this.commentsRepository.remove(comment);
  }

  async findCommentsByNews(newsId: number) {
    return this.commentsRepository.find({
      where: { news: { id: newsId } },
      relations: ['user'],
    });
  }
}
