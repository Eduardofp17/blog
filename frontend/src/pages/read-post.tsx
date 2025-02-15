import { PostCard } from '@/components/ui/post';
import { useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { PostProvider } from '@/contexts/PostContext';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useTranslation } from 'react-i18next';

export function ReadPost() {
  const location = useLocation();
  const post = location.state?.post;
  const { loading } = useGlobalContext();
  const { t } = useTranslation();

  if (!post) {
    return <div>Post não encontrado.</div>;
  }

  return (
    <PostProvider>
      <>
        <div className="flex flex-col min-h-screen animate-scroll">
          {loading ? (
            <main className="flex-grow flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black dark:border-white"></div>
            </main>
          ) : (
            <main className="flex-grow items-center  ">
              <section
                id="feed"
                className="flex flex-col py-28 sm:py-36 px-6 max-w-4xl mx-auto gap-6"
              >
                <span className="text-sm sm:text-md flex flex-row items-center gap-2 animate-scroll">
                  <ChevronLeft />
                  <a href="/feed" className="underline">
                    {t('back to the feed')}
                  </a>
                </span>
                <PostCard post={post} />
              </section>
            </main>
          )}
        </div>
      </>
    </PostProvider>
  );
}
