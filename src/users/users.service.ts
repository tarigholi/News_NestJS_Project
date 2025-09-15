import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findById(id: number) {
    return this.findOne(id);
  }

  async create(data: Partial<User>) {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async updateRefreshToken(userId: number, token: string | null) {
    const user = await this.findOne(userId);
    user.currentHashedRefreshToken = token ?? undefined;
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.findOne(userId);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async updatePassword(userId: number, hashedPassword: string) {
    const user = await this.findOne(userId);
    user.password = hashedPassword;
    return this.usersRepository.save(user);
  }
}
