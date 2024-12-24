import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InteractionsController } from './interactions.controller';
import { Post, PostSchema } from '../schemas/post.schema';
import { Comments, CommentsSchema } from '../schemas/comments.schema';
import { Replies, RepliesSchema } from '../schemas/replies.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: Replies.name, schema: RepliesSchema },
    ]),
  ],
  providers: [InteractionsService],
  controllers: [InteractionsController],
})
export class InteractionsModule {}
