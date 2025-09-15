import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new NotFoundException('Invalid credentials');
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.setRefreshToken(refresh_token, user.id);
    return { access_token, refresh_token };
  }

  async register(userData: any) {
    const hashed = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({ ...userData, password: hashed });
    return user;
  }

  async setRefreshToken(token: string, userId: number) {
    const hashed = await bcrypt.hash(token, 10);
    await this.usersService.updateRefreshToken(userId, hashed);
  }

  async removeRefreshToken(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async getTokens(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.currentHashedRefreshToken) throw new NotFoundException('Refresh token not found');
    const match = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if (!match) throw new NotFoundException('Invalid refresh token');
    return this.getTokens(user.id, user.email, user.role);
  }

  async getUserById(userId: number) {
    return this.usersService.findById(userId);
  }
}
