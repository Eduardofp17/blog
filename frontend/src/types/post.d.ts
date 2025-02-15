export type Post = {
  _id: string;
  contentPt: string;
  contentEn: string;
  author: string;
  likes: number;
  impressions: number;
  likedBy: string[];
  comments: number;
  createdAt: string;
  updatedAt: string;
};
