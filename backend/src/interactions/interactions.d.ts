import { Types } from 'mongoose';

export type Comment = {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  postId: Types.ObjectId;
  replies: Types.ObjectId;
  likedBy: Types.ObjectId;
  dislikedBy: Types.ObjectId;
  likes: number;
  dislikes: number;
  impressions: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Reply = {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  commentId: Types.ObjectId;
  mention: Types.ObjectId;
  likedBy: Types.ObjectId;
  dislikedBy: Types.ObjectId;
  likes: number;
  dislikes: number;
  impressions: number;
  createdAt: Date;
  updatedAt: Date;
};
