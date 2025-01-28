import { Module } from '@nestjs/common';
import { Post, PostSchema } from '../schemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule.register({}),
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
