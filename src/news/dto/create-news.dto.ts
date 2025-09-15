import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import type { NewsStatus } from '../entities/news.entity';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsEnum(['draft', 'published'])
  status?: NewsStatus;

  @IsInt()
  @Type(() => Number)
  categoryId: number;

  @IsInt()
  @Type(() => Number)
  authorId: number;
}
