import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hashed },
    });

    return {
      user: { id: user.id, email: user.email, role: user.role },
      access_token: await this.signToken(user.id, user.email, user.role),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const valid = user && (await bcrypt.compare(dto.password, user.password));
    if (!user || !valid) throw new UnauthorizedException('Invalid credentials');

    return { access_token: await this.signToken(user.id, user.email, user.role) };
  }

  private signToken(id: number, email: string, role: Role) {
    return this.jwt.signAsync({ sub: id, email, role });
  }
}