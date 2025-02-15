export type Reply = {
  _id: string;
  content: string;
  author: string;
  commentId: string;
  mention: string;
  likedBy: string[];
  dislikedBy: string[];
  likes: number;
  dislikes: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
};
