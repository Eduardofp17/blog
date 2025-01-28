import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Images, ImagesSchema } from 'src/schemas/images.schema';
import { PostSchema, Post } from 'src/schemas/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Images.name, schema: ImagesSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
