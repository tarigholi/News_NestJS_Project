import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoriesRepo.create({ ...dto, slug: dto.name.toLowerCase().replace(/ /g, '-') });
    return this.categoriesRepo.save(category);
  }

  findAll() {
    return this.categoriesRepo.find();
  }
async findOne(id: number) {
  return this.categoriesRepo.findOne({ where: { id } });
}

  async update(id: number, dto: CreateCategoryDto) {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    category.name = dto.name;
    category.slug = dto.name.toLowerCase().replace(/ /g, '-');
    return this.categoriesRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return this.categoriesRepo.remove(category);
  }
}
