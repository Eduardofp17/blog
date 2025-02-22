import { Card, CardTitle, CardHeader, CardFooter, CardContent } from './card';
import {
  ThumbsUp,
  Eye,
  MessageCircle,
  Clock,
  Calendar,
  SendHorizonal,
  X,
  User as UserIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { ApiSuccessResponse, CommentResponse, Post as PostType } from '@/types';
import { Locale } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Comment as CommentComponent } from './comment.tsx';
import { Comment } from '@/types';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Button } from '@/components/ui/button.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { useNavigate } from 'react-router-dom';
import { usePostContext } from '@/contexts/PostContext.tsx';
import { ChangeEvent } from 'react';
import { User } from '@/types';
import { useAuthContext } from '@/contexts/AuthContext.tsx';
import { Methods, useApiRequest } from '@/hooks/use-api-request.ts';
import { SuccessCode } from '@/response-codes/index.ts';

interface Props {
  post: PostType;
}

export function PostCard({ post }: Props) {
  const { replyingTo, mentioning, commentId } = usePostContext();
  const [postContent, setPostContent] = useState<string>('');
  const [Post, setPost] = useState<PostType>(post);
  const [liked, setLiked] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
  const [newReply, setNewReply] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');

  const [user, setUser] = useState<User>({
    _id: '',
    profilePic: '',
    email: '',
    name: '',
    username: '',
    lastname: '',
    email_verified: false,
    createdAt: '',
    updatedAt: '',
  });
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const locale: Locale = i18n.language === 'pt' ? ptBR : enUS;
  const createdDate = new Date(Post.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale });
  const navigate = useNavigate();
  const {
    commentContent,
    editComment,
    setReloadComment,
    setCommentContent,
    setEditComment,
    reloadPost,
    setReloadPost,
  } = usePostContext();
  const { loggedIn, token, getUserId } = useAuthContext();
  const { request } = useApiRequest();

  const handleUser = async () => {
    try {
      const response = await request<User>(
        `/users/${post.author}`,
        Methods.GET,
        { 'Content-Type': 'application/json' }
      );

      if (!response.success) return;
      const { data } = response as ApiSuccessResponse<User>;
      setUser(data);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const handlePost = async () => {
    try {
      const response = await request<PostType>(
        `/posts/${post._id}`,
        Methods.GET,
        { 'Content-Type': 'application/json' }
      );

      if (!response.success) return;
      const { data } = response as ApiSuccessResponse<PostType>;
      setPost(data);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  useEffect(() => {
    handlePost();
    handleUser();
  }, []);

  useEffect(() => {
    const sub = getUserId();
    const alreadyLikedIt =
      Array.isArray(Post.likedBy) &&
      Post.likedBy.some((userId) => userId === sub);
    setLiked(alreadyLikedIt);
  }, [Post]);

  const likeAction = async () => {
    try {
      const response = await request(`/posts/${Post._id}/likes`, Methods.POST, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
      if (!response.success) return;
      handlePost();
      setLiked(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const unlikeAction = async () => {
    try {
      const response = await request(
        `/posts/${Post._id}/likes`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );
      if (!response.success) return;
      handlePost();
      setLiked(false);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const getComments = async () => {
    try {
      const response = await request<CommentResponse>(
        `/posts/${Post._id}/comments`,
        Methods.GET,
        {
          'Content-Type': 'application/json',
        }
      );

      if (!response.success) return;
      const { data } = response as ApiSuccessResponse<CommentResponse>;

      setComments(data.comments);
      setCommentsVisible(true);
    } catch (err) {
      setCommentsVisible(false);
      throw new Error('Internal Server Error');
    }
  };

  const hideComments = () => {
    setCommentsVisible(false);
  };

  const redirectToSignIn = () => {
    navigate('/signin');
  };

  const handleReplyChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewReply(value);
  };

  const createReply = async () => {
    try {
      const response = await request(
        `/posts/${Post._id}/comments/${commentId}/replies/?mention=${replyingTo}`,
        Methods.POST,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        {
          content: newReply,
        },
        SuccessCode.REPLY_SUCCESSFULLY_CREATED
      );

      if (!response.success) return;

      setReloadComment(true);
      setNewReply('');
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const createComment = async () => {
    try {
      const response = await request(
        `/posts/${post._id}/comments`,
        Methods.POST,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        { content: newComment },
        SuccessCode.COMMENT_SUCCESSFULLY_CREATED
      );

      if (!response.success) return;

      getComments();
      handlePost();
      setNewComment('');
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const handleEditComment = async () => {
    try {
      const response = await request(
        `/posts/${Post._id}/comments/${commentId}`,
        Methods.PATCH,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        { content: commentContent },
        SuccessCode.COMMENT_SUCCESSFULLY_EDITED
      );

      if (!response.success) return;

      setReloadComment(true);
      setEditComment(false);
      setCommentContent('');
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };
  useEffect(() => {
    if (currentLanguage === 'en') {
      setPostContent(Post.contentEn);
    } else if (currentLanguage === 'pt') {
      setPostContent(Post.contentPt);
    }
  }, [currentLanguage, Post.contentEn, Post.contentPt]);

  useEffect(() => {
    if (reloadPost) {
      handlePost();
      getComments();
    }
    setReloadPost(false);
  }, [reloadPost]);
  return (
    <Card className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto ">
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center ">
          <div className="flex items-center space-x-4 ">
            <div className="h-10 w-10 rounded-full dark:bg-gray-200 bg-gray-800 flex items-center justify-center">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="User profile picture"
                  className="rounded-full"
                />
              ) : (
                <span className="text-xl font-semibold">
                  <UserIcon className="dark:text-black text-white" />
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-sm ">@{user.username}</CardTitle>
              <div className="flex items-center text-gray-500 dark:text-gray-400 ">
                <Clock className="mr-1 h-4 w-4 text-sm" />
                <span className="text-xs">{timeAgo}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{Post.impressions}</span>
          </div>
        </div>
        <div className="bg-gray-500 w-full h-[0.05em] p"></div>
      </CardHeader>

      <CardContent className="prose prose-lg dark:prose-invert ">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-xl sm:text-2xl font-bold mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg sm:text-xl font-bold mt-6 mb-3">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-sm sm:text-base">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-disc ml-6 mb-4 text-sm sm:text-base">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal ml-6 mb-4 text-sm sm:text-base">
                {children}
              </ol>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 dark:bg-gray-800 rounded px-1 text-xs sm:text-base max-w-full whitespace-pre-wrap">
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic  text-sm sm:text-base">
                {children}
              </blockquote>
            ),
          }}
        >
          {postContent}
        </ReactMarkdown>
        <div
          id="comments"
          className={`by-2 ${commentsVisible ? 'flex' : 'hidden'} flex-col mt-14 border-t-2 pt-2`}
        >
          <div id="top" className="flex flex-row justify-between  top-0">
            <p className="text-left font-bold">{t('comments')}:</p>
            <X onClick={hideComments} />
          </div>
          {comments.length === 0 ? (
            <span className="mx-auto py-6 font-bold">
              {t('no comments yet')}
            </span>
          ) : (
            <ScrollArea
              id="componentContainer"
              className="my-3 max-h-96 overflow-y-auto flex flex-col gap-3 sm:px-6 "
            >
              {comments.map((commentVal, index) => (
                <CommentComponent
                  Comment={commentVal}
                  key={index}
                  user={user}
                />
              ))}
            </ScrollArea>
          )}
          {replyingTo === '' ? (
            editComment ? (
              <div
                className={`${loggedIn ? 'flex' : 'hidden'}  bottom-0 flex flex-row items-center  justify-between`}
              >
                <Textarea
                  placeholder={t('type-comment')}
                  rows={1}
                  className="flex-1 border rounded p-2 resize-none max-w-[80%] h-2"
                  onChange={(e) => setCommentContent(e.target.value)}
                  value={commentContent}
                ></Textarea>
                <Button
                  className="rounded-full h-12 w-12"
                  variant="ghost"
                  onClick={handleEditComment}
                >
                  <SendHorizonal
                    style={{ width: '50px', height: '50px', padding: '10px' }}
                    className="dark:bg-gray-200 bg-gray-800 rounded-full dark:text-gray-800 text-gray-200"
                  />
                </Button>
              </div>
            ) : (
              <div
                className={`${loggedIn ? 'flex' : 'hidden'}  bottom-0 flex flex-row items-center  justify-between`}
              >
                <Textarea
                  placeholder={t('type-comment')}
                  rows={1}
                  className="flex-1 border rounded p-2 resize-none max-w-[80%] h-2"
                  onChange={(e) => setNewComment(e.target.value)}
                  value={newComment}
                ></Textarea>
                <Button
                  className="rounded-full h-12 w-12"
                  variant="ghost"
                  onClick={createComment}
                >
                  <SendHorizonal
                    style={{ width: '50px', height: '50px', padding: '10px' }}
                    className="dark:bg-gray-200 bg-gray-800 rounded-full dark:text-gray-800 text-gray-200"
                  />
                </Button>
              </div>
            )
          ) : (
            <div
              className={`${loggedIn ? 'flex' : 'hidden'}  bottom-0 flex flex-row items-center  justify-between`}
            >
              <Textarea
                placeholder={`${t('type-reply')}: ${mentioning}`}
                rows={1}
                className="flex-1 border rounded p-2 resize-none max-w-[80%] h-2"
                onChange={handleReplyChange}
                value={newReply}
              ></Textarea>
              <Button
                className="rounded-full h-12 w-12"
                variant="ghost"
                type="button"
                onClick={createReply}
              >
                <SendHorizonal
                  style={{ width: '50px', height: '50px', padding: '10px' }}
                  className="dark:bg-gray-200 bg-gray-800 rounded-full dark:text-gray-800 text-gray-200"
                />
              </Button>
            </div>
          )}
          <div className={`${!loggedIn ? 'flex' : 'hidden'} mx-auto`}>
            <Button onClick={redirectToSignIn}>
              {t('signin to interact')}
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t">
        <div className="w-full flex justify-between items-center pt-4">
          <div className="flex space-x-6">
            <button
              className="flex items-center gap-0.5 text-gray-500"
              onClick={liked ? unlikeAction : likeAction}
            >
              <ThumbsUp
                className={`h-5 w-5 hover:text-blue-600`}
                fill={
                  liked ? ' rgb(37 99 235 / var(--tw-bg-opacity, 1))' : 'none'
                }
                stroke={
                  liked
                    ? ' rgb(37 99 235 / var(--tw-bg-opacity, 1))'
                    : 'currentColor'
                }
              />
              <span>{Post.likes}</span>
            </button>
            <button
              className="flex items-center gap-0.5 text-gray-500 "
              onClick={commentsVisible ? hideComments : getComments}
            >
              <MessageCircle className="h-5 w-5 hover:text-green-600 transition-colors" />
              <span>{Post.comments}</span>
            </button>
          </div>
          <div className="text-sm text-gray-500 gap-0.5">
            <Calendar className="inline h-4 w-4 mr-1" />
            {new Date(Post.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
