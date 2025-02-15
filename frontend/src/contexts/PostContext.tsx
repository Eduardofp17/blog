import React, { useState, useContext, createContext, ReactNode } from 'react';

type PostContextType = {
  replyingTo: string;
  setReplyingTo: React.Dispatch<React.SetStateAction<string>>;
  mentioning: string;
  setMentioning: React.Dispatch<React.SetStateAction<string>>;
  commentId: string;
  setCommentId: React.Dispatch<React.SetStateAction<string>>;
  reloadComment: boolean;
  setReloadComment: React.Dispatch<React.SetStateAction<boolean>>;
  editComment: boolean;
  setEditComment: React.Dispatch<React.SetStateAction<boolean>>;
  commentContent: string;
  setCommentContent: React.Dispatch<React.SetStateAction<string>>;
  reloadPost: boolean;
  setReloadPost: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
  const [replyingTo, setReplyingTo] = useState<string>('');
  const [mentioning, setMentioning] = useState<string>('');
  const [commentId, setCommentId] = useState<string>('');
  const [reloadComment, setReloadComment] = useState<boolean>(false);
  const [editComment, setEditComment] = useState<boolean>(false);
  const [commentContent, setCommentContent] = useState<string>('');
  const [reloadPost, setReloadPost] = useState<boolean>(false);
  return (
    <PostContext.Provider
      value={{
        replyingTo,
        setReplyingTo,
        mentioning,
        setMentioning,
        commentId,
        setCommentId,
        reloadComment,
        setReloadComment,
        editComment,
        setEditComment,
        commentContent,
        setCommentContent,
        reloadPost,
        setReloadPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
}
