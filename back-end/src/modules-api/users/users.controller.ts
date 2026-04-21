import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser('id') userId: number) {
    const user = await this.usersService.getCurrentUser(userId);
    return {
      status: true,
      message: 'Lấy thông tin thành công',
      data: user,
    };
  }

  @Put('me')
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.updateProfile(userId, dto);
    return {
      status: true,
      message: 'Cập nhật thành công',
      data: user,
    };
  }

  @Get('saved-images')
  async getSavedImages(@CurrentUser('id') userId: number) {
    const images = await this.usersService.getSavedImages(userId);
    return {
      status: true,
      message: 'Lấy ảnh đã lưu thành công',
      data: images,
    };
  }

  @Get('my-images')
  async getMyImages(@CurrentUser('id') userId: number) {
    const images = await this.usersService.getMyImages(userId);
    return {
      status: true,
      message: 'Lấy ảnh của bạn thành công',
      data: images,
    };
  }
}
