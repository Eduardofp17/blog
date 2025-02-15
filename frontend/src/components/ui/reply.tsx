import { ApiSuccessResponse, Reply as ReplyType, User } from '@/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import {
  User as UserIcon,
  Clock,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Trash,
  Reply as ReplyIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { Locale } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { usePostContext } from '@/contexts/PostContext';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from './dropdown-menu';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import { SuccessCode } from '@/response-codes';

interface Props {
  replyProp: ReplyType;
  user: User;
  mention: string;
  postId: string;
}

export function Reply({ replyProp, user, mention, postId }: Props) {
  const { i18n } = useTranslation();
  const locale: Locale = i18n.language === 'pt' ? ptBR : enUS;
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [reply, setReply] = useState<ReplyType>(replyProp);
  const createdDate = new Date(reply.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale });
  const {
    replyingTo,
    setReplyingTo,
    setMentioning,
    setCommentId,
    setReloadComment,
  } = usePostContext();
  const { t } = useTranslation();
  const { getUserId, token } = useAuthContext();
  const userId = getUserId();
  const isAuthor = userId === replyProp.author;
  const { request } = useApiRequest();

  const createReply = () => {
    if (replyingTo === '') {
      if (user) {
        setReplyingTo(user._id);
        setMentioning(user.username);
        setCommentId(replyProp.commentId);
      }
    } else {
      setReplyingTo('');
      setMentioning('');
    }
  };

  const handleReply = async () => {
    try {
      const response = await request<ReplyType>(
        `/posts/${postId}/comments/${reply.commentId}/replies/${reply._id}`,
        Methods.GET,
        { 'Content-Type': 'application/json' }
      );

      if (!response.success) return;

      const { data } = response as ApiSuccessResponse<ReplyType>;
      setReply(data);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const handleDeleteReply = async () => {
    try {
      const response = await request(
        `/posts/${postId}/comments/${reply.commentId}/replies/${reply._id}`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        {},
        SuccessCode.REPLY_SUCCESFULLY_DELETED
      );

      if (!response.success) return;

      setReloadComment(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };
  const likeReplyAction = async () => {
    try {
      const response = await request(
        `/posts/${postId}/comments/${reply.commentId}/replies/${reply._id}/like`,
        Methods.POST,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleReply();
      setDisliked(false);
      setLiked(true);
    } catch (err) {}
  };

  const unlikeReplyAction = async () => {
    try {
      const response = await request(
        `/posts/${postId}/comments/${reply.commentId}/replies/${reply._id}/like`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleReply();
      setLiked(false);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };
  const dislikeReplyAction = async () => {
    try {
      const response = await request(
        `/posts/${postId}/comments/${reply.commentId}/replies/${reply._id}/dislike`,
        Methods.POST,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleReply();
      setLiked(false);
      setDisliked(true);
    } catch (err) {}
  };
  const removedislikeReplyAction = async () => {
    try {
      const response = await request(
        `/posts/${postId}/comments/${reply.commentId}/replies/${reply._id}/dislike`,
        Methods.DELETE,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.success) return;

      handleReply();
      setDisliked(false);
    } catch (err) {}
  };

  useEffect(() => {
    const sub = getUserId();
    const alreadyLikedIt =
      Array.isArray(reply.likedBy) &&
      reply.likedBy.some((userId) => userId === sub);
    const alreadyDislikedIt =
      Array.isArray(reply.dislikedBy) &&
      reply.dislikedBy.some((userId) => userId === sub);
    setLiked(alreadyLikedIt);
    setDisliked(alreadyDislikedIt);
  }, []);
  return (
    <Card className="w-full mt-2">
      <CardHeader className="p-2">
        <div id="replyHeader" className="flex flex-row justify-between">
          <div id="replyAuthor" className="flex flex-row items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center dark:bg-gray-200 bg-gray-800 rounded-full dark:text-gray-800 text-gray-200">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="User profile picture"
                  className="rounded-full"
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <div>
              <span className="font-bold text-xs sm:text-md">
                @{user.username}
              </span>
              <div className="flex flex-row items-center text-gray-500 dark:text-gray-400 ">
                <Clock className="mr-1 h-3 w-3 text-xs" />
                <span className="text-xs ">{timeAgo}</span>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className={`h-4 w-4 ${isAuthor ? '' : 'hidden'}`} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-10 p-2">
              <DropdownMenuItem onClick={handleDeleteReply}>
                <Trash /> {t('delete reply')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="mt-2 py-1 px-2">
        <p>
          <span className="bg-gray-300 dark:bg-gray-800 p-1 text-xs rounded-md">
            @{mention}
          </span>
          , {reply.content}
        </p>
      </CardContent>
      <CardFooter className="p-2 flex flex-row justify-between">
        <div id="interact" className="flex flex-row text-gray-500 gap-3">
          <button
            className="flex flex-row gap-0.5 items-center"
            onClick={liked ? unlikeReplyAction : likeReplyAction}
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
            <p className="text-sm translate-y-[0.5px]">{reply.likes}</p>
          </button>
          <button
            className="flex flex-row gap-0.5 items-center"
            onClick={disliked ? removedislikeReplyAction : dislikeReplyAction}
          >
            <ThumbsDown
              className="h-4 w-4 hover:text-red-600 transition-colors"
              fill={disliked ? 'rgb(220, 38, 38)' : 'none'}
              stroke={disliked ? 'rgb(220, 38, 38)' : 'currentColor'}
            />
            <p className="text-sm ">{reply.dislikes}</p>
          </button>
          <button
            className="flex flex-row gap-0.5 items-center"
            onClick={createReply}
          >
            <ReplyIcon className="w-4 h-4" />
            <p className="text-sm translate-y-[0.5px]">{t('reply')}</p>
          </button>
        </div>
        <div className="flex items-center gap-0.5 text-gray-500">
          <Eye className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-xs translate-y-[0.5px]">
            {reply.impressions}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
