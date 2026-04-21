import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        user_id: true,
        email: true,
        fullname: true,
        age: true,
        avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.users.update({
      where: { id: userId },
      data: {
        fullname: dto.fullname,
        age: dto.age,
        avatar: dto.avatar,
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

  async getSavedImages(userId: number) {
    const savedImages = await this.prisma.users.findMany({
      where: { id: userId },
      include: {
        saved_images: {
          include: {
            users: {
              select: {
                user_id: true,
                fullname: true,
                age: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return savedImages.map((item) => item.saved_images);
  }

  async getMyImages(userId: number) {
    const images = await this.prisma.users.findMany({
      where: { id: userId },
      include: {
        saved_images: {
          select: {
            user_id: true,
            fullname: true,
            age: true,
            avatar: true,
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    return images;
  }
}
