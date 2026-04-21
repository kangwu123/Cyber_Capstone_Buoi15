import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SavedImagesService } from './saved-images.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SaveImageDto } from './dto/save-image.dto';

@Controller('saved-images')
@UseGuards(JwtAuthGuard)
export class SavedImagesController {
  constructor(private readonly savedImagesService: SavedImagesService) {}

  @Get('check/:imageId')
  async checkIfSaved(@Param('imageId', ParseIntPipe) imageId: number, @CurrentUser('id') userId: number) {
    const isSaved = await this.savedImagesService.checkIfSaved(
      userId,
      imageId,
    );
    return {
      status: true,
      message: 'Kiểm tra thành công',
      data: { saved: isSaved },
    };
  }

  @Post()
  async saveImage(
    @CurrentUser('id') userId: number,
    @Body() dto: SaveImageDto,
  ) {
    const result = await this.savedImagesService.saveImage(userId, dto);
    return {
      status: true,
      message: 'Lưu ảnh thành công',
      data: result,
    };
  }

  @Delete(':imageId')
  async unsaveImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @CurrentUser('id') userId: number,
  ) {
    const result = await this.savedImagesService.unsaveImage(userId, imageId);
    return {
      status: true,
      message: 'Xóa ảnh lưu thành công',
      data: result,
    };
  }
}
