import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto, UpdatePostDto, PaginationDto } from './dto';
import { ForbiddenError, NotFoundError } from 'src/errors/http.error';
import { ErrorCode } from 'src/errors/error-codes.enum';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  createNewPost(authorId: string, dto: CreatePostDto) {
    return this.postModel.create({ ...dto, author: authorId });
  }

  async getAllPosts(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.postModel.find().skip(skip).limit(limit).exec(),
      this.postModel.countDocuments().exec(),
    ]);
    await this.postModel.updateMany(
      { _id: { $in: data.map((post) => post._id) } },
      { $inc: { impressions: 1 } },
    );
    const totalPages = Math.ceil(total / limit);
    return {
      posts: data,
      total,
      totalPages,
      currentPage: page,
    };
  }

  async getPostById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    return post;
  }

  async updatePostById(authorId: string, id: string, dto: UpdatePostDto) {
    if (!Types.ObjectId.isValid(id))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);
    if (post.author.toString() !== authorId)
      throw new ForbiddenError(ErrorCode.UNABLE_TO_EDIT_THIS_POST);
    return post.updateOne({ ...dto });
  }

  async deletePostById(authorId: string, id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);
    if (post.author.toString() !== authorId)
      throw new ForbiddenError(ErrorCode.UNABLE_TO_DELETE_THIS_POST);

    return post.deleteOne();
  }
}
