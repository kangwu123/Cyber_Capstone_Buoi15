import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PrismaService } from '@/modules-system/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByImageId(imageId: number) {
    const image = await this.prisma.image.findUnique({
      where: { image_id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const comments = await this.prisma.comments.findMany({
      where: { image_id: imageId },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return comments;
  }

  async createComment(
    userId: number,
    imageId: number,
    dto: CreateCommentDto,
  ) {
    const image = await this.prisma.image.findUnique({
      where: { image_id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const comment = await this.prisma.comments.create({
      data: {
        content: dto.content,
        user_id: userId,
        image_id: imageId,
        created_at: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    });

    return comment;
  }
}
