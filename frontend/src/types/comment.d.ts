export type Comment = {
  _id: string;
  content: string;
  author: string;
  postId: string;
  likes: number;
  dislikes: number;
  impressions: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likedBy: string[];
  dislikedBy: string[];
};
