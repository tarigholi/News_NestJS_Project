import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { News } from './entities/news.entity';
import { UsersModule } from '../users/users.module';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([News]),
    UsersModule,
    CategoriesModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService], 
})
export class NewsModule {}
