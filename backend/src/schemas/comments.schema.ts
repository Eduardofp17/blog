import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Comments extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'posts', required: true })
  postId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'replies' })
  replies: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  likedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'user' })
  dislikedBy: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  likes: number;

  @Prop({ required: true, default: 0 })
  dislikes: number;

  @Prop({ required: true, default: 0 })
  impressions: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
