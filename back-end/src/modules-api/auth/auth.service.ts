import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../modules-system/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email đã tồn tại');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const user = await this.prisma.users.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullname: dto.fullname,
        age: dto.age ?? null,
        avatar: dto.avatar ?? null,
      },
      select: {
        user_id: true,
        email: true,
        fullname: true,
        age: true,
        avatar: true,
      },
    });

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await this.verifyPassword(dto.password, user.mat_khau))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const payload = { sub: user.user_id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async verifyPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
