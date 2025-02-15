import { useTheme } from './theme-provider';
import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export function Footer() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <footer className="w-full  border-t-2 py-2 sm:p-4 animate-scroll ">
      <div className="flex flex-col gap-16 items-center max-w-screen-2xl mx-auto rounded">
        <div className="flex flex-row items-center justify-between w-full px-3 sm:px-10">
          <img
            className="w-30 h-15 lg:w-40 lg:h-20"
            src={
              theme === 'light'
                ? '/images/logo-light-theme.svg'
                : '/images/logo-dark-theme.svg'
            }
            alt="Logo"
          />

          <div id="social" className="flex flex-col gap-5 items-center">
            <p>{t('social-medias')}</p>
            <div id="socialMedias" className="flex flex-row gap-4">
              <a href="https://github.com/Eduardofp17">
                <FaGithub className="text-3xl hover:opacity-70" />
              </a>
              <a href="https://www.linkedin.com/in/eduardo-fernandes-pinheiro-19b133209/">
                <FaLinkedin className="text-3xl hover:opacity-70" />
              </a>
              <a
                href="https://x.com/@edudeveloper07"
                className="text-3xl hover:opacity-70"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>
        <p className="text-xs mx-auto text-center">{t('copywright')}</p>
      </div>
    </footer>
  );
}
