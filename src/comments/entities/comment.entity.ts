import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { News } from '../../news/entities/news.entity';
import { User } from '../../users/entities/user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => News, news => news.id, { onDelete: 'CASCADE' })
  news: News;

  @ManyToOne(() => User, user => user.id, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @Column('text')
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
