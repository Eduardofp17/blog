import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post } from '../schemas/post.schema';
import { Comments } from '../schemas/comments.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './interactions';
import { Replies } from '../schemas/replies.schema';
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from 'src/errors/http.error';
import { ErrorCode } from 'src/errors/error-codes.enum';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
    @InjectModel(Replies.name) private readonly repliesModel: Model<Replies>,
  ) {}
  async addLike(userId: string, postId: string) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const likeAlreadyExist = await this.postModel.findOne({
      likedBy: userId,
      _id: postId,
    });
    if (likeAlreadyExist)
      throw new ConflictError(ErrorCode.USER_ALREADY_LIKED_THIS_POST);

    await this.postModel.updateOne(
      { _id: postId },
      { $addToSet: { likedBy: userId }, $inc: { likes: 1 } },
    );
    return { msg: 'liked', success: true };
  }

  async removeLike(userId: string, postId: string) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const likeAlreadyExist = await this.postModel.findOne({
      likedBy: userId,
      _id: postId,
    });
    if (!likeAlreadyExist)
      throw new NotFoundError(ErrorCode.USER_HAVE_NOT_LIKED_THIS_POST);

    await this.postModel.updateOne(
      { _id: postId },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } },
    );
  }

  async getComments(postId: string) {
    if (!Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comments = await this.commentModel.find({ postId });

    await this.commentModel.updateMany(
      {
        _id: { $in: comments.map((comment) => comment._id) },
      },
      { $inc: { impressions: 1 } },
      { $new: true },
    );
    return { comments: comments };
  }

  async getCommentById(postId: string, commentId: string) {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);

    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    return comment;
  }

  async addComment(userId: string, postId: string, dto: CreateCommentDto) {
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    await this.postModel.updateOne({ _id: postId }, { $inc: { comments: 1 } });
    const comment = await this.commentModel.create({
      ...dto,
      postId,
      author: userId,
    });
    return { comment: comment };
  }

  async editComment(
    userId: string,
    postId: string,
    commentId: string,
    dto: CreateCommentDto,
  ) {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(postId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment: Comment | null = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);
    if (comment.author.toString() !== userId)
      throw new ForbiddenError(ErrorCode.UNABLE_TO_EDIT_THIS_COMMENT);

    const editedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      {
        ...dto,
      },
      { new: true },
    );

    return editedComment;
  }

  async deleteComment(userId: string, postId: string, commentId: string) {
    if (
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(postId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment: Comment | null = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    if (comment.author.toString() !== userId)
      throw new ForbiddenError(ErrorCode.UNABLE_TO_DELETE_THIS_COMMENT);

    await this.postModel.updateOne(
      { _id: postId },
      { $addToSet: { $inc: { comments: -1 } } },
    );
    const commentDeleted = await this.commentModel.findByIdAndDelete(commentId);
    await this.postModel.updateOne({ _id: postId }, { $inc: { comments: -1 } });
    await this.repliesModel.deleteMany({ commentId });
    return commentDeleted;
  }

  async replyComment(
    userId: string,
    postId: string,
    commentId: string,
    mentionId: string,
    dto: CreateCommentDto,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(mentionId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const reply = await this.repliesModel.create({
      ...dto,
      author: userId,
      commentId,
      mention: mentionId,
    });
    return reply;
  }

  async deleteReply(
    userId: string,
    postId: string,
    commentId: string,
    replyId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(replyId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const reply = await this.repliesModel.findById(replyId);
    if (!reply) throw new NotFoundError(ErrorCode.REPLY_NOT_FOUND);
    if (reply.author.toString() !== userId)
      throw new ForbiddenError(ErrorCode.UNABLE_TO_DELETE_THIS_REPLY);
    await this.repliesModel.findByIdAndDelete(replyId);
  }

  async getReplies(postId: string, commentId: string) {
    if (!Types.ObjectId.isValid(commentId) || !Types.ObjectId.isValid(postId))
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);
    const replies = await this.repliesModel.find({ commentId });

    await this.repliesModel.updateMany(
      { _id: { $in: replies.map((reply) => reply._id) } },
      { $inc: { impressions: 1 } },
      { $new: true },
    );
    return { replies: replies };
  }

  async getReplyById(postId: string, commentId: string, replyId: string) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(replyId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);
    const reply = await this.repliesModel.findById(replyId);
    if (!reply) throw new NotFoundError(ErrorCode.REPLY_NOT_FOUND);

    return reply;
  }

  async likeAComment(userId: string, postId: string, commentId: string) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const likeAlreadyExist = await this.commentModel.findOne({
      likedBy: userId,
      _id: commentId,
    });

    if (likeAlreadyExist)
      throw new ConflictError(ErrorCode.USER_ALREADY_LIKED_THIS_COMMENT);

    const alreadyDislikedIt = await this.commentModel.findOne({
      dislikedBy: userId,
      _id: commentId,
    });
    if (alreadyDislikedIt)
      await this.commentModel.updateOne(
        { _id: commentId },
        { $pull: { dislikedBy: userId }, $inc: { dislikes: -1 } },
      );

    await this.commentModel.updateOne(
      { _id: commentId },
      { $addToSet: { likedBy: userId }, $inc: { likes: 1 } },
    );
  }

  async dislikeAComment(userId: string, postId: string, commentId: string) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const alreadyDislikedIt = await this.commentModel.findOne({
      dislikedBy: userId,
      _id: commentId,
    });
    if (alreadyDislikedIt)
      throw new ConflictError(ErrorCode.USER_ALREADY_DISLIKED_THIS_COMMENT);

    const alreadyLikedIt = await this.commentModel.findOne({
      likedBy: userId,
      _id: commentId,
    });
    if (alreadyLikedIt)
      await this.commentModel.updateOne(
        { _id: commentId },
        { $pull: { likedBy: userId }, $inc: { likes: -1 } },
      );

    await this.commentModel.updateOne(
      { _id: commentId },
      { $addToSet: { dislikedBy: userId }, $inc: { dislikes: 1 } },
    );
  }

  async likeAReply(
    userId: string,
    postId: string,
    commentId: string,
    replyId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(replyId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const reply = await this.repliesModel.findById(replyId);
    if (!reply) throw new NotFoundError(ErrorCode.REPLY_NOT_FOUND);

    const likeAlreadyExist = await this.repliesModel.findOne({
      likedBy: userId,
      _id: replyId,
    });
    if (likeAlreadyExist)
      throw new ConflictError(ErrorCode.USER_ALREADY_LIKED_THIS_REPLY);

    const alreadyDislikedIt = await this.repliesModel.findOne({
      dislikedBy: userId,
      _id: replyId,
    });
    if (alreadyDislikedIt)
      await this.repliesModel.updateOne(
        { _id: replyId },
        { $pull: { dislikedBy: userId }, $inc: { dislikes: -1 } },
      );
    await this.repliesModel.updateOne(
      { _id: replyId },
      { $addToSet: { likedBy: userId }, $inc: { likes: 1 } },
    );
  }

  async dislikeAReply(
    userId: string,
    postId: string,
    commentId: string,
    replyId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(replyId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const reply = await this.repliesModel.findById(replyId);
    if (!reply) throw new NotFoundError(ErrorCode.REPLY_NOT_FOUND);

    const alreadyDislikedIt = await this.repliesModel.findOne({
      dislikedBy: userId,
      _id: replyId,
    });
    if (alreadyDislikedIt)
      throw new ConflictError(ErrorCode.USER_ALREADY_DISLIKED_THIS_REPLY);

    const alreadyLikedIt = await this.repliesModel.findOne({
      likedBy: userId,
      _id: replyId,
    });
    if (alreadyLikedIt)
      await this.repliesModel.updateOne(
        { _id: replyId },
        { $pull: { likedBy: userId }, $inc: { likes: -1 } },
      );

    await this.repliesModel.updateOne(
      { _id: replyId },
      { $addToSet: { dislikedBy: userId }, $inc: { dislikes: 1 } },
    );
  }

  async removeLikeInAComment(
    userId: string,
    postId: string,
    commentId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);
    const alreadyLikedIt = await this.commentModel.findOne({
      _id: commentId,
      likedBy: userId,
    });

    if (!alreadyLikedIt)
      throw new NotFoundError(ErrorCode.USER_HAVE_NOT_LIKED_THIS_COMMENT);

    await this.commentModel.updateOne(
      { _id: commentId },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } },
    );
  }

  async removeDislikeInAComment(
    userId: string,
    postId: string,
    commentId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const alreadyDislikedIt = await this.commentModel.findOne({
      _id: commentId,
      dislikedBy: userId,
    });

    if (!alreadyDislikedIt)
      throw new NotFoundError(ErrorCode.USER_HAVE_NOT_DISLIKED_THIS_COMMENT);

    await this.commentModel.updateOne(
      { _id: commentId },
      { $pull: { dislikedBy: userId }, $inc: { dislikes: -1 } },
    );
  }

  async removeLikeInAReply(
    userId: string,
    postId: string,
    commentId: string,
    replyId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(replyId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const reply = await this.repliesModel.findById(replyId);
    if (!reply) throw new NotFoundError(ErrorCode.REPLY_NOT_FOUND);

    const alreadyLikedIt = await this.repliesModel.findOne({
      _id: replyId,
      likedBy: userId,
    });

    if (!alreadyLikedIt)
      throw new NotFoundError(ErrorCode.USER_HAVE_NOT_LIKED_THIS_REPLY);

    await this.repliesModel.updateOne(
      { _id: replyId },
      { $pull: { likedBy: userId }, $inc: { likes: -1 } },
    );
  }

  async removeDislikeInAReply(
    userId: string,
    postId: string,
    commentId: string,
    replyId: string,
  ) {
    if (
      !Types.ObjectId.isValid(commentId) ||
      !Types.ObjectId.isValid(userId) ||
      !Types.ObjectId.isValid(postId) ||
      !Types.ObjectId.isValid(replyId)
    )
      throw new ForbiddenError(ErrorCode.INVALID_ID);

    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundError(ErrorCode.POST_NOT_FOUND);

    const comment = await this.commentModel.findById(commentId);
    if (!comment) throw new NotFoundError(ErrorCode.COMMENT_NOT_FOUND);

    const reply = await this.repliesModel.findById(replyId);
    if (!reply) throw new NotFoundError(ErrorCode.REPLY_NOT_FOUND);

    const alreadyDislikedIt = await this.repliesModel.findOne({
      _id: replyId,
      dislikedBy: userId,
    });

    if (!alreadyDislikedIt)
      throw new NotFoundError(ErrorCode.USER_HAVE_NOT_DISLIKED_THIS_REPLY);

    await this.repliesModel.updateOne(
      { _id: replyId },
      { $pull: { dislikedBy: userId }, $inc: { dislikes: -1 } },
    );
  }
}
