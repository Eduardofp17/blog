import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type Props = {
  errorCode?: number;
  errorMessage?: string;
  handleAction?: () => void;
  buttonTitle?: string;
};

export const Error: React.FC<Props> = ({
  errorCode = 404,
  errorMessage = 'Page not found',
  handleAction,
  buttonTitle = 'Go to the homepage',
}) => {
  document.title = 'Eduardofp Blog - Error';

  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigateToHome = () => {
    navigate('/');
  };

  return (
    <>
      <section className="max-w-screen-md flex flex-col gap-8 mx-auto pt-24 sm:pt-28 sm:px-8 lg:pt-36 px-6 pb-28 animate-scroll text-center">
        <h1 className="text-3xl font-bold">{t(errorMessage)}</h1>

        <h2 className="text-7xl sm:text-9xl font-bold text-transparent [-webkit-text-stroke:1px_black] dark:[-webkit-text-stroke:1px_white]">
          Error {errorCode}
        </h2>

        <Button
          className="animate-pulse"
          onClick={handleAction ?? handleNavigateToHome}
        >
          {t(buttonTitle)}
        </Button>
      </section>
    </>
  );
};
