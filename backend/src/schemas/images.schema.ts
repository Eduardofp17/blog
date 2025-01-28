import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Images extends Document {
  @Prop({ required: true, unique: true })
  imageName: string;

  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  authorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'posts', required: true })
  relatedPostId: Types.ObjectId;

  @Prop({ required: true })
  imageData: string;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);
