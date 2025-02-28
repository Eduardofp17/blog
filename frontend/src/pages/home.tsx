import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Rss } from 'lucide-react';
import { useGlobalContext } from '@/contexts/GlobalContext';

export const HomePage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  document.title = 'Eduardofp Blog - Home';

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { loading } = useGlobalContext();

  return loading ? (
    children
  ) : (
    <div className="flex flex-col items-center max-w-screen-2xl mx-auto pt-12 sm:pt-36 px-4">
      <section
        className="w-full flex flex-col-reverse sm:flex-row p-4 sm:p-8 items-center gap-8"
        id="home"
      >
        <div className="absolute bg-blue-300 rounded-full w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] top-[10%] left-[10%] shadow-lg z-[-1] blur-3xl opacity-60 dark:opacity-20"></div>
        <div className="absolute bg-purple-300 rounded-full w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] top-[50%] right-[10%] shadow-xl z-[-1] blur-3xl opacity-60 dark:opacity-20"></div>
        <div className="absolute bg-green-300 rounded-full w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] bottom-[10%] left-[15%] shadow-md z-[-1] blur-3xl opacity-60 dark:opacity-20"></div>
        <div className="absolute bg-blue-600 rounded-full w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] bottom-[50%] left-[50%] shadow-md z-[-1] blur-3xl opacity-60 dark:opacity-20"></div>

        <div className="w-full sm:w-1/2 flex flex-col gap-6 sm:gap-12 items-center sm:items-start">
          <div id="texts" className="w-full flex flex-col gap-4">
            <h1 className="text-lg md:text-xl lg:text-5xl  font-bold text-center sm:text-left animate-scroll">
              {t('hero-title')}
            </h1>
            <p className="text-sm md:text-md lg:text-2xl text-center sm:text-left animate-scroll">
              {t('subtitle')}
            </p>
          </div>
          <Button
            type="submit"
            onClick={() => navigate('/feed')}
            className="w-full max-w-40 xl:max-w-60 m-auto text-md sm:text-lg p-4 sm:p-6 rounded-xl animate-scroll"
          >
            <Rss className="mr-2" />
            {t('cta')}
          </Button>
        </div>
        <div className="w-[80%] sm:w-1/2 pt-20 sm:pt-0 flex justify-center">
          <img
            src="/images/hero-image.webp"
            srcSet="/images/hero-image-small.webp 480w, /images/hero-image-medium.webp 768w, /images/hero-image-large.webp 1200w"
            sizes="(max-width: 640px) 80vw, (max-width: 768px) 50vw, 600px"
            width="1200"
            height="800"
            alt="Main hero image showcasing the page content"
            className="w-full sm:w-auto sm:ml-12 animate-scroll"
          />
        </div>
      </section>
      <section
        id="about"
        className="flex flex-col pt-32 pb-32 gap-24 items-center"
      >
        <p className="text-bm uppercase tracking-widest animate-scroll">
          {t('about-title')}
        </p>
        <div className="flex flex-col gap-5 sm:gap-0 sm:flex-row justify-between items-center">
          <div id="left" className="w-[50%] flex items-center">
            <img
              src="/images/me-profile.webp"
              srcSet="/images/me-profile-small.webp 480w, /images/me-profile-medium.webp 768w, /images/me-profile-large.webp 1200w"
              sizes="(max-width: 640px) 100vw, 50vw"
              width="400"
              height="400"
              loading="lazy"
              alt="Profile picture of Eduardo Pinheiro"
              className="w-full sm:w-1/2 animate-scroll bg-blue-900 pt-2 rounded-full mx-auto"
            />
          </div>
          <div id="right" className="w-[50%] animate-scroll">
            <p className="text-sm sm:text-xs text-center md:text-md lg:text-lg">
              {t('about-me')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
