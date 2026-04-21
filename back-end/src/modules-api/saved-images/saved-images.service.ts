import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma.service';
import { SaveImageDto } from './dto/save-image.dto';

@Injectable()
export class SavedImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkIfSaved(userId: number, imageId: number) {
    const saved = await this.prisma.saved_images.findUnique({
      where: {
        user_id_image_id: {
          user_id: userId,
          image_id: imageId,
        },
      },
    });

    return !!saved;
  }

  async saveImage(userId: number, dto: SaveImageDto) {
    const image = await this.prisma.image.findUnique({
      where: { image_id: dto.image_id },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const existing = await this.prisma.saved_images.findUnique({
      where: {
        user_id_image_id: {
          user_id: userId,
          image_id: dto.image_id,
        },
      },
    });

    if (existing) {
      return { saved: true, message: 'Ảnh đã được lưu trước đó' };
    }

    const saved = await this.prisma.saved_images.create({
      data: {
        user_id: userId,
        image_id: dto.image_id,
        saved_at: new Date(),
      },
    });

    return { saved: true, image_id: saved.image_id };
  }

  async unsaveImage(userId: number, imageId: number) {
    const image = await this.prisma.image.findUnique({
      where: { image_id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Ảnh không tồn tại');
    }

    const existing = await this.prisma.saved_images.findUnique({
      where: {
        user_id_image_id: {
          user_id: userId,
          image_id: imageId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Bạn chưa lưu ảnh này');
    }

    await this.prisma.saved_images.delete({
      where: {
        user_id_image_id: {
          user_id: userId,
          image_id: imageId,
        },
      },
    });

    return { image_id: imageId };
  }
}
