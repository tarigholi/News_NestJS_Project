// data-source.ts
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { News } from './src/news/entities/news.entity';
import { Category } from './src/categories/entities/category.entity';
import { Comment } from './src/comments/entities/comment.entity';
import { Like } from './src/likes/entities/like.entity';
import { Bookmark } from './src/bookmarks/entities/bookmark.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
 port: +process.env.POSTGRES_PORT!, 
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, News, Category, Comment, Like, Bookmark],
  migrations: ['src/migrations/*.ts'], // مسیر TypeScript
  synchronize: false,
});
