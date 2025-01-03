import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { CreatePostDto } from './dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  createNewPost(authorId: string, dto: CreatePostDto) {
    return this.postModel.create({ ...dto, author: authorId });
  }

  async getAllPosts() {
    const posts = await this.postModel.find();
    if (!posts) throw new NotFoundException('No posts found.');
    await this.postModel.updateMany(
      { _id: { $in: posts.map((post) => post._id) } },
      { $inc: { impressions: 1 } },
    );
    return posts;
  }

  async getPostById(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new ForbiddenException('Invalid id.');
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException();
    await this.postModel.findByIdAndUpdate(
      id,
      { $inc: { impressions: 1 } },
      { $new: true },
    );
    return post;
  }

  async updatePostById(authorId: string, id: string, dto: UpdatePostDto) {
    if (!Types.ObjectId.isValid(id))
      throw new ForbiddenException('Invalid id.');
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found.');
    if (post.author.toString() !== authorId) throw new ForbiddenException();
    return post.updateOne({ ...dto });
  }

  async deletePostById(authorId: string, id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new ForbiddenException('Invalid id.');
    const post = await this.postModel.findById(id);
    if (!post) throw new NotFoundException('Post not found.');
    if (post.author.toString() !== authorId) throw new ForbiddenException();
    return post.deleteOne();
  }
}
