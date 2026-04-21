import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../modules-system/prisma.service';
import { CreateImageDto } from './dto/create-image.dto';
import type { Multer } from 'multer';

@Injectable()
export class ImagesService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllImages(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [images, total] = await Promise.all([
            this.prisma.image.findMany({
                include: {
                    users: {
                        select: {
                            id: true,
                            fullName: true,
                            avatar: true,
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { image_id: 'desc' },
            }),
            this.prisma.image.count(),
        ]);

        return {
            items: images,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async searchImages(name: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [images, total] = await Promise.all([
            this.prisma.image.findMany({
                where: {
                    image_name: {
                        contains: name,
                    },
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
                skip,
                take: limit,
                orderBy: { image_id: 'desc' },
            }),
            this.prisma.image.count({
                where: {
                    image_name: {
                        contains: name,
                    },
                },
            }),
        ]);

        return {
            items: images,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async getImageDetail(imageId: number) {
        const image = await this.prisma.image.findUnique({
            where: { image_id: imageId },
            include: {
                users: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!image) {
            throw new NotFoundException('Ảnh không tồn tại');
        }

        return image;
    }

    async createImage(userId: number, dto: CreateImageDto, file: Multer.File) {
        const path = `/images/${file.filename}`;

        const image = await this.prisma.image.create({
            data: {
                image_name: dto.image_name,
                path,
                description: dto.description,
                user_id: userId,
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

        return image;
    }

    async deleteImage(imageId: number, userId: number) {
        const image = await this.prisma.image.findUnique({
            where: { image_id: imageId },
            select: { user_id: true },
        });

        if (!image) {
            throw new NotFoundException('Ảnh không tồn tại');
        }

        if (image.user_id !== userId) {
            throw new ForbiddenException('Bạn không có quyền xóa ảnh này');
        }

        await this.prisma.image.delete({
            where: { image_id: imageId },
        });

        return { image_id: imageId };
    }
}
