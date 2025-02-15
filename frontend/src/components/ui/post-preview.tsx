import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ThumbsUp, Eye, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Post } from '@/types';

interface props {
  post: Post;
}
export function PostPreview({ post }: props) {
  const { i18n } = useTranslation();
  const [postContent, setPostContent] = useState<string>('');
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<number>(0);
  const [impressions, setImpressions] = useState<number>(0);
  const currentLanguage = i18n.language;
  const navigate = useNavigate();

  useEffect(() => {
    setLikes(post.likes);
    setComments(post.comments);
    setImpressions(post.impressions);
  }, [
    likes,
    comments,
    impressions,
    post.likes,
    post.impressions,
    post.comments,
  ]);
  useEffect(() => {
    if (currentLanguage === 'en') {
      setPostContent(post.contentEn);
    } else if (currentLanguage === 'pt') {
      setPostContent(post.contentPt);
    }
  }, [currentLanguage, post.contentEn, post.contentPt]);

  function truncateMarkdown(content: string, maxLength: number): string {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + '...';
    }
    return content;
  }
  const toPost = () => {
    navigate(`/feed/post/${post._id}`, { state: { post: post } });
  };
  return (
    <div
      onClick={toPost}
      className="prose prose-lg max-w-none border shadow-lg p-4 rounded-lg  cursor-pointer animate-scroll"
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <div className="border-b-2 w-full">
              <h1 className="text-xl font-bold">{children}</h1>
            </div>
          ),
          h2: ({ children }) => (
            <h2 className="font-bold text-lg">{children}</h2>
          ),
          p: ({ children }) => (
            <p className="my-2 text-sm line-clamp-2">{children}</p>
          ),
          ul: ({ children }) => (
            <div className="line-clamp-2 overflow-hidden text-ellipsis">
              <ul className="list-disc ml-6">{children}</ul>
            </div>
          ),
        }}
      >
        {truncateMarkdown(postContent || '', 143)}
      </ReactMarkdown>
      <div className="border-t-2 mt-6 flex flex-row w-full justify-between items-center p-2">
        <div id="interactions" className="flex flex-row gap-4 items-center">
          <div id="likes" className="flex flex-row gap-1 items-center">
            <ThumbsUp className="dark:hover:text-blue-200 hover:text-blue-800 w-5 h-5" />
            <p className="text-base">{likes}</p>
          </div>
          <div id="comments" className="flex flex-row gap-1 items-center ">
            <MessageCircle className="hover:text-green-800 dark:hover:text-green-200 w-5 h-5" />
            <p className="text-base">{comments}</p>
          </div>
        </div>
        <div id="impressions" className="flex flex-row gap-1 items-center">
          <Eye className="w-5 h-5" />
          <p className="text-base">{impressions}</p>
        </div>
      </div>
    </div>
  );
}
