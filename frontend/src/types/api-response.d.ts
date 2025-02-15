import type { Post, Reply, Comment, UserCookie } from "./index";

export type SigninResponse = {
  access_token: string;
  user: UserCookie;
}

export type Response = {
  success: boolean;
  data:? {};
}

export type PostResponse = {
  posts: Post[];
  total: number;
	totalPages: number;
	currentPage: string;
} 

export type RepliesResponse = {
  replies: Reply[];
}

export type CommentResponse = {
  comments: Comment[];
}