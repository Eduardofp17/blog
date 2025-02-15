import {
  Comment as CommentType,
  User,
  Reply,
  ApiSuccessResponse,
  RepliesResponse,
} from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  MoreVertical,
  User as UserIcon,
  Clock,
  ThumbsDown,
  ThumbsUp,
  Eye,
  Reply as ReplyIcon,
  Pen,
  Trash,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Replies } from './replies';
import { usePostContext } from '@/contexts/PostContext';
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
import { useAuthContext } from '@/contexts/AuthContext';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import { SuccessCode } from '@/response-codes/index';

interface Props {
  Comment: CommentType;
  user: User;
}

export const Comment = ({ Comment, user }: Props) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [comment, setComment] = useState<CommentType>(Comment);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language === 'pt' ? ptBR : enUS;
  const createdDate = new Date(comment.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale });
  const {
    replyingTo,
    setReplyingTo,
    setMentioning,
    setCommentId,
    reloadComment,
    setReloadComment,
    setCommentContent,
    editComment,
    setEditComment,
    setReloadPost,
  } = usePostContext();
  const { getUserId, token } = useAuthContext();
  const userId = getUserId();
  const isAuthor = userId === comment.author;
  const { request } = useApiRequest();

  const handleComment = async () => {
    try {
      const response = await request<CommentType>(
        `/posts/${comment.postId}/comments/${comment._id}`,
        Methods.GET,
        { 'Content-Type': 'application/json' }
      );

      if (!response.success) return;
      const { data } = response as ApiSuccessResponse<CommentType>;
      setComment(data);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const getReplies = async () => {
    try {
      const response = await request<RepliesResponse>(
        `/posts/${comment.postId}/comments/${comment._id}/replies`,
        Methods.GET,
        { 'Content-Type': 'application/json' }
      );

      if (!response.success) return;

      const { data } = response as ApiSuccessResponse<RepliesResponse>;
      setReplies(data.replies);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const likeAction = async () => {
    try {
      const response = await request(
        `/posts/${comment.postId}/comments/${comment._id}/like`,
        Methods.POST,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;
      handleComment();
      setDisliked(false);
      setLiked(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const unlikeAction = async () => {
    try {
      const response = await request(
        `/posts/${comment.postId}/comments/${comment._id}/like`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleComment();
      setLiked(false);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const dislikeAction = async () => {
    try {
      const response = await request(
        `/posts/${comment.postId}/comments/${comment._id}/dislike`,
        Methods.POST,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleComment();
      setLiked(false);
      setDisliked(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const removeDislikeAction = async () => {
    try {
      const response = await request(
        `/posts/${comment.postId}/comments/${comment._id}/dislike`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleComment();
      setDisliked(false);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const createReply = () => {
    if (replyingTo === '') {
      if (user) {
        setReplyingTo(user._id);
        setMentioning(user.username);
        setCommentId(comment._id);
      }
    } else {
      setReplyingTo('');
      setMentioning('');
    }
  };

  const handleEditComment = () => {
    if (!editComment) {
      setCommentContent(comment.content);
      setCommentId(comment._id);
      setEditComment(true);
      setMentioning('');
      setReplyingTo('');
    }
  };

  const handleDeleteComment = async () => {
    try {
      const response = await request(
        `/posts/${comment.postId}/comments/${comment._id}`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        {},
        SuccessCode.COMMENT_SUCCESSFULLY_DELETED
      );

      if (!response.success) return;
      setReloadPost(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  useEffect(() => {
    if (reloadComment) {
      getReplies();
      handleComment();
    }
    setReloadComment(false);
  }, [reloadComment]);

  useEffect(() => {
    getReplies();
    const sub = getUserId();
    const alreadyLikedIt =
      Array.isArray(comment.likedBy) &&
      comment.likedBy.some((userId) => userId === sub);
    const alreadyDislikedIt =
      Array.isArray(comment.dislikedBy) &&
      comment.dislikedBy.some((userId) => userId === sub);

    setLiked(alreadyLikedIt);
    setDisliked(alreadyDislikedIt);
  }, []);

  return (
    <div className=" shadow-lg p-2 rounded-md bg-slate-50 dark:bg-slate-900 mb-3">
      <div
        id="commentHeader"
        className="flex flex-row justify-between border-b-2 pb-2"
      >
        <div id="commentAuthor" className="flex flex-row items-center gap-2">
          <div className="h-8 w-8 flex items-center justify-center dark:bg-gray-200 bg-gray-800 rounded-full dark:text-gray-800 text-gray-200">
            <span className="text-xl font-semibold ">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="User profile picture"
                  className="rounded-full"
                />
              ) : (
                <UserIcon />
              )}
            </span>
          </div>
          <div>
            <span className="font-bold text-sm sm:text-md">
              @{user.username}
            </span>
            <div className="flex items-center text-gray-500 dark:text-gray-400 ">
              <Clock className="mr-1 h-4 w-4 text-sm" />
              <span className="text-xs">{timeAgo}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className={`h-4 w-4 ${isAuthor ? '' : 'hidden'}`} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-10 p-2">
            <DropdownMenuItem onClick={handleEditComment}>
              <Pen /> {t('edit comment')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDeleteComment}>
              <Trash /> {t('delete comment')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm sm:text-md font-light px-2 pt-3">
        {comment.content}
      </p>
      <Replies repliesData={replies} postId={comment.postId} />
      <div className="w-full flex justify-between items-center pt-4">
        <div className="flex space-x-6">
          <button
            className="flex items-center gap-0.5 text-gray-500"
            onClick={liked ? unlikeAction : likeAction}
          >
            <ThumbsUp
              className={`h-4 w-4 hover:text-blue-600`}
              fill={
                liked ? ' rgb(37 99 235 / var(--tw-bg-opacity, 1))' : 'none'
              }
              stroke={
                liked
                  ? ' rgb(37 99 235 / var(--tw-bg-opacity, 1))'
                  : 'currentColor'
              }
            />
            <span>{comment.likes}</span>
          </button>
          <button
            className="flex items-center gap-0.5 text-gray-500 "
            onClick={disliked ? removeDislikeAction : dislikeAction}
          >
            <ThumbsDown
              className="h-4 w-4 hover:text-red-600 transition-colors"
              fill={disliked ? 'rgb(220, 38, 38)' : 'none'}
              stroke={disliked ? 'rgb(220, 38, 38)' : 'currentColor'}
            />
            <span className="text-sm ">{comment.dislikes}</span>
          </button>
          <button
            className="flex flex-row gap-0.5 items-center text-gray-500"
            onClick={createReply}
          >
            <ReplyIcon className="w-4 h-4" />
            <p className="text-sm translate-y-[0.5px]">{t('reply')}</p>
          </button>
        </div>
        <div
          id="impressions"
          className="flex flex-row gap-0.5 items-center text-gray-500"
        >
          <Eye className="w-5 h-5" />
          <p className="text-sm">{comment.impressions}</p>
        </div>
      </div>
    </div>
  );
};
