import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ErrorCode } from 'src/errors/error-codes.enum';
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from 'src/errors/http.error';
import { Images } from 'src/schemas/images.schema';
import { Post } from 'src/schemas/post.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(Images.name) private readonly imageModel: Model<Images>,
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
  ) {}

  async getPostImages(postId: string) {
    if (!Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const post = await this.postsModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const images = await this.imageModel.find({ relatedPostId: postId });

    return images;
  }

  async uploadImage(userId: string, postId: string, file: Express.Multer.File) {
    if (!Types.ObjectId.isValid(postId) || !Types.ObjectId.isValid(userId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    if (!file) throw new BadRequestError(ErrorCode.MISSING_IMAGE);
    const post = await this.postsModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);
    const base64image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const imageName = file.originalname;
    const image = await this.imageModel.findOne({ imageName });
    if (image) throw new ConflictError(ErrorCode.IMAGE_ALREADY_EXIST);
    const newImage = await this.imageModel.create({
      relatedPostId: postId,
      imageName,
      imageData: base64image,
      authorId: userId,
    });

    return newImage;
  }

  async deleteImage(userId: string, postId: string, imageId: string) {
    if (
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(imageId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postsModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const image = await this.imageModel.findOne({ _id: imageId });
    if (!image) throw new NotFoundError(ErrorCode.IMAGE_NOT_FOUND);
    if (image.authorId.toString() !== userId)
      throw new ForbiddenError(ErrorCode.UNABLE_TO_DELETE_THIS_IMAGE);

    await this.imageModel.findByIdAndDelete(imageId);
  }
}
