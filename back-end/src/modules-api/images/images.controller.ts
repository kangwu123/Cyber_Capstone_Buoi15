import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Multer } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImages(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.imagesService.getAllImages(
      Number(page),
      Number(limit),
    );
    return {
      status: true,
      message: 'Lấy danh sách ảnh thành công',
      data,
    };
  }

  @Get('search')
  async searchImages(
    @Query('name') name: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.imagesService.searchImages(
      name,
      Number(page),
      Number(limit),
    );
    return {
      status: true,
      message: 'Tìm kiếm ảnh thành công',
      data,
    };
  }

  @Get(':id')
  async getImageDetail(@Param('id', ParseIntPipe) imageId: number) {
    const image = await this.imagesService.getImageDetail(imageId);
    return {
      status: true,
      message: 'Lấy chi tiết ảnh thành công',
      data: image,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Chỉ chấp nhận file ảnh'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  async createImage(
    @CurrentUser('id') userId: number,
    @Body() dto: CreateImageDto,
    @UploadedFile() file: Multer.File,
  ) {
    const image = await this.imagesService.createImage(userId, dto, file);
    return {
      status: true,
      message: 'Tạo ảnh thành công',
      data: image,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteImage(
    @Param('id', ParseIntPipe) imageId: number,
    @CurrentUser('id') userId: number,
  ) {
    const result = await this.imagesService.deleteImage(imageId, userId);
    return {
      status: true,
      message: 'Xóa ảnh thành công',
      data: result,
    };
  }
}
