import { PostPreview } from '@/components/ui/post-preview';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { useCallback } from 'react';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import type { ApiSuccessResponse, Post } from '@/types';
import { PostResponse } from '@/types';

export const Feed: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [apiError, setApiError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { loading, setLoading } = useGlobalContext();
  const { request } = useApiRequest();

  const fetchPosts = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await request<PostResponse>(
        `/posts/feed?page=${page}&limit=5`,
        Methods.GET,
        { 'Content-Type': 'application/json' }
      );
      if (!response.success) return;
      const { data } = response as ApiSuccessResponse<PostResponse>;
      setPosts(data.posts);
      setTotalPages(totalPages);
    } catch (error) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts(currentPage);
  }, [currentPage, fetchPosts]);

  useEffect(() => {
    if (apiError && errorMessage) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: errorMessage,
      });
      setApiError(false);
      setErrorMessage('');
    }
  }, [apiError, errorMessage, toast, t]);

  if (posts.length === 0) {
    return (
      <>
        <section
          id="feed"
          className="h-max pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto text-xl font-bold items-center text-center"
        >
          <h1 className="animate-scroll">{t('no-articles')}</h1>
        </section>
      </>
    );
  }
  return loading ? (
    children
  ) : (
    <>
      <section
        id="feed"
        className="max-w-screen-md flex flex-col gap-8 mx-auto pt-24 sm:pt-28 sm:px-8 lg:pt-36 px-6 pb-28"
      >
        <span className="text-sm sm:text-md flex flex-row items-center gap-2 animate-scroll">
          <ChevronLeft />
          <a href="/" className="underline">
            {t('back to the home')}
          </a>
        </span>
        <h1 className="text-left text-xl font-bold animate-scroll">
          {t('feed-title')}
        </h1>
        <div id="articles" className="flex flex-col w-full gap-4">
          {posts.map((post, i) => (
            <PostPreview key={i} post={post} />
          ))}
        </div>
        <Pagination className="pt-12 animate-scroll">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setCurrentPage(1)} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>
    </>
  );
};
