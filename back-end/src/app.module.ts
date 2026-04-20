import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './modules-system/prisma/prisma.module';
import { AuthModule } from './modules-api/auth/auth.module';
import { UsersModule } from './modules-api/users/users.module';
import { ImagesModule } from './modules-api/images/images.module';
import { CommentsModule } from './modules-api/comments/comments.module';
import { SavedImagesModule } from './modules-api/saved-images/saved-images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ImagesModule,
    CommentsModule,
    SavedImagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
