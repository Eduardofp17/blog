import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  contentPt: string;

  @Prop({ required: true })
  contentEn: string;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  author: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  likes: number;

  @Prop({ required: true, default: 0 })
  comments: number;

  @Prop({ required: true, default: 0 })
  impressions: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'users' }], default: [] })
  likedBy: Types.ObjectId[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
