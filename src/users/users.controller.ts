import { Controller, Patch, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Patch('me/password')
  async updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    const user = await this.usersService.findOne(req.user.id);
    if (!user) throw new Error('User not found');
    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) throw new Error('Old password incorrect');
    const newHashed = await bcrypt.hash(dto.newPassword, 10);
    await this.usersService.updatePassword(req.user.id, newHashed);
    return { message: 'Password updated' };
  }
}
