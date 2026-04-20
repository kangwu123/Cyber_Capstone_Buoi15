import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':imageId')
  async getCommentsByImageId(
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const comments = await this.commentsService.getCommentsByImageId(imageId);
    return {
      status: true,
      message: 'Lấy danh sách bình luận thành công',
      data: comments,
    };
  }

  @Post(':imageId')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('imageId', ParseIntPipe) imageId: number,
    @CurrentUser('id') userId: number,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.createComment(
      userId,
      imageId,
      dto,
    );
    return {
      status: true,
      message: 'Tạo bình luận thành công',
      data: comment,
    };
  }
}
