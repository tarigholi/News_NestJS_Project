import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CategoriesService } from '../categories/categories.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
    private readonly categoriesService: CategoriesService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateNewsDto): Promise<News> {
    const category = await this.categoriesService.findOne(dto.categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const author = await this.usersService.findOne(dto.authorId);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const news = this.newsRepository.create({
      ...dto,
      category,
      author,
      slug: dto.title.toLowerCase().replace(/\s+/g, '-'),
    });

    return this.newsRepository.save(news);
  }

  async findAll(query: {
    search?: string;
    category?: number;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: News[]; total: number }> {
    const { search, category, status, page = 1, limit = 10 } = query;

    const qb = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.category', 'category')
      .leftJoinAndSelect('news.author', 'author')
      .orderBy('news.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      qb.andWhere('(news.title ILIKE :search OR news.content ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (category) {
      qb.andWhere('news.categoryId = :category', { category });
    }

    if (status) {
      qb.andWhere('news.status = :status', { status });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  async findOneBySlug(slug: string): Promise<News> {
    const news = await this.newsRepository.findOne({
      where: { slug },
      relations: ['category', 'author'],
    });
    if (!news) throw new NotFoundException('News not found');
    return news;
  }

  async update(id: number, dto: UpdateNewsDto): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) throw new NotFoundException('News not found');

    Object.assign(news, dto);
    return this.newsRepository.save(news);
  }

  async remove(id: number): Promise<void> {
    const result = await this.newsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('News not found');
    }
  }

  async uploadImage(id: number, file: Express.Multer.File): Promise<News> {
    const news = await this.newsRepository.findOne({ where: { id } });
    if (!news) throw new NotFoundException('News not found');

    news.image = file.filename;
    return this.newsRepository.save(news);
  }
 async findOneById(id: number) {
  return this.newsRepository.findOne({
    where: { id },
    relations: ['author', 'category'],
  });
}

}
