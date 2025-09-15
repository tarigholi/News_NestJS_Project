import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

export type NewsStatus = 'draft' | 'published';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Category, category => category.news, { eager: true })
  category: Category;

  @ManyToOne(() => User, { eager: true })
  author: User;

  @Column({ type: 'enum', enum: ['draft', 'published'], default: 'draft' })
  status: NewsStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
