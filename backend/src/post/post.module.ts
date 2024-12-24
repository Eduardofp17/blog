import { Module } from '@nestjs/common';
import { Post, PostSchema } from '../schemas/post.schema';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule.register({}),
    AuthModule,
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}
