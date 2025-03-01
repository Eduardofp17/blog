import { useState, useEffect } from 'react';
import { useTheme } from './theme-provider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ModeToggle } from './mode-toggle';
import { SwitchLanguage } from './switch-language';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerClose,
} from '@/components/ui/drawer';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './dropdown-menu';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { DialogDescription } from '@radix-ui/react-dialog';

export function Header() {
  const [apiError, setApiError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('');
  const { loggedIn, logout, isAuthTokenValid } = useAuthContext();
  const { toast } = useToast();
  const { setLoading, handleGetUser, user, setUser } = useGlobalContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (loggedIn && !isAuthTokenValid()) {
      logout();
      return;
    }
  }, []);

  useEffect(() => {
    if (loggedIn && isAuthTokenValid()) {
      handleGetUser();
    }
  }, []);

  useEffect(() => {
    if (loggedIn && isAuthTokenValid()) {
      handleGetUser();
    }
  }, [loggedIn]);

  useEffect(() => {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (location.pathname === '/' && window.scrollY < 100) {
              setActiveSection('home');
              return;
            }
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);

  const handleSignin = () => {
    navigate('/signin');
    setIsDropdownOpen(false);
  };

  const handleSignup = () => {
    navigate('/signup');
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    setLoading(true);
    logout();
    setIsDialogOpen(false);
    setLoading(false);
    setUser({
      _id: '',
      email: '',
      username: '',
      profilePic: '',
      name: '',
      lastname: '',
      email_verified: false,
      createdAt: '',
      updatedAt: '',
    });
  };

  const handleNavigateToProfile = () => {
    navigate('/me/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (apiError && errorMessage) {
      toast({
        variant: 'destructive',
        title: t('error'),
        description: t(errorMessage),
      });
      setApiError(false);
      setErrorMessage('');
    }
  }, [apiError]);

  return (
    <header className="w-full  border-b-2 p-4 animate-scroll backdrop-blur fixed z-10">
      <Dialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        defaultOpen={false}
      >
        <DialogContent className="w-[90%]">
          <DialogHeader>
            <DialogTitle className="text-left">{t('logout')}</DialogTitle>
          </DialogHeader>
          <DialogDescription>{t('confirm logout')}</DialogDescription>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('cancel')}
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              {t('logout')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-row items-center justify-between mx-auto max-w-screen-2xl">
        {loggedIn ? (
          <div className="md:hidden flex flex-row">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-row items-center cursor-pointer ">
                  <div
                    className={`h-8 w-8 rounded-full dark:bg-gray-200 bg-gray-800 flex items-center justify-center ${user.profilePic ? 'dark:border-gray-200 border-2 border-gray-800' : ''}`}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="User profile picture"
                        className="rounded-full h-8 w-8"
                      />
                    ) : (
                      <span className="text-xl font-semibold">
                        <UserIcon className="dark:text-black text-white" />
                      </span>
                    )}
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <div className="px-2 mt-2 flex flex-col justify-start">
                  <DropdownMenuItem
                    className="p-0 py-1 cursor-pointer"
                    onClick={handleNavigateToProfile}
                  >
                    {' '}
                    <UserIcon /> {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 p-0 py-1 cursor-pointer"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    {' '}
                    <LogOut /> {t('logout')}
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          ''
        )}
        <Link to="/">
          <img
            className="w-24 h-15 lg:w-40 lg:h-18"
            width={100}
            height={40}
            src={
              theme === 'light'
                ? '/images/logo-light-theme.webp'
                : '/images/logo-dark-theme.webp'
            }
            alt="Logo"
          />
        </Link>
        <div className="md:hidden flex flex-row">
          <Drawer
            direction="right"
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
          >
            <DrawerTrigger asChild>
              <Menu className="w-6 h-6" role="img" aria-label="Open menu" />
            </DrawerTrigger>

            <DrawerContent className="gap-6">
              <DrawerHeader>
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerClose>
                  <X className="w-6 h-6" />
                </DrawerClose>
              </DrawerHeader>
              <nav className="flex flex-col gap-4 items-center">
                <a
                  href="/#home"
                  className={`text-base hover:text-lg border-b-2 border-transparent
                hover:border-blue-500 transition-all duration-300 
                ${activeSection === 'home' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {t('home')}
                </a>

                <a
                  href="/#about"
                  className={`text-base hover:text-lg border-b-2 border-transparent
                hover:border-blue-500 transition-all duration-300 
                ${activeSection === 'about' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {t('about')}
                </a>
                {/* <a
                  href=""
                  className={`text-base hover:text-lg border-b-2 border-transparent
                hover:border-blue-500 transition-all duration-300 
                ${activeSection === 'portfolio' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {t('portfolio')}
                </a> */}
                <a
                  href="/feed"
                  className={`text-base hover:text-lg border-b-2 border-transparent
                 hover:border-blue-500 transition-all duration-300 
                 ${activeSection === 'feed' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  {t('feed')}
                </a>
              </nav>

              <div
                className={`flex flex-col p-3 gap-4 ${loggedIn ? 'hidden' : ''}`}
              >
                <Button variant="outline" onClick={handleSignin}>
                  {t('signin')}
                </Button>
                <Button onClick={handleSignup}>{t('signup')}</Button>
              </div>

              <div className="flex flex-row justify-center w-full gap-10">
                <SwitchLanguage />
                <ModeToggle />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
        <div className="hidden md:flex md:flex-row gap-2 xl:gap-6 items-center">
          <nav className="flex flex-row gap-4 xl:gap-6 items-center">
            <a
              href="/#home"
              className={` text-sm hover:text-base xl:text-lg xl:hover:text-xl border-b-2 border-transparent
                hover:border-blue-500 transition-all duration-300 
                ${activeSection === 'home' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
            >
              {t('home')}
            </a>

            <a
              href="/#about"
              className={`text-sm hover:text-base xl:text-lg  xl:hover:text-xl border-b-2 border-transparent
                hover:border-blue-500 transition-all duration-300 
                ${activeSection === 'about' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
            >
              {t('about')}
            </a>
            {/* <a
              href=""
              className={`text-sm  hover:text-base xl:text-lg xl:hover:text-xl border-b-2 border-transparent
                hover:border-blue-500 transition-all duration-300 
                ${activeSection === 'portfolio' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
            >
              {t('portfolio')}
            </a> */}
            <a
              href="/feed"
              className={`text-sm hover:text-base xl:text-lg xl:hover:text-xl border-b-2 border-transparent
                 hover:border-blue-500 transition-all duration-300 
                 ${activeSection === 'feed' ? 'text-blue-500 border-blue-500' : 'border-transparent'}`}
            >
              {t('feed')}
            </a>
          </nav>

          {!loggedIn ? (
            <div className="flex flex-row gap-4 xl:gap-6 items-center">
              <Button variant="outline" onClick={handleSignin}>
                {t('signin')}
              </Button>
              <Button onClick={handleSignup}>{t('signup')}</Button>{' '}
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex flex-row items-center cursor-pointer ">
                  <div
                    className={`h-10 w-10 rounded-full dark:bg-gray-200 bg-gray-800 flex items-center justify-center ${user.profilePic ? 'dark:border-gray-200 border-2 border-gray-800' : ''}`}
                  >
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt="User profile picture"
                        className="rounded-full h-10 w-10 object-fill"
                      />
                    ) : (
                      <span className="text-xl font-semibold">
                        <UserIcon className="dark:text-black text-white" />
                      </span>
                    )}
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <div className="px-2 mt-2 flex flex-col justify-start">
                  <DropdownMenuItem
                    className="p-0 py-1 cursor-pointer"
                    onClick={handleNavigateToProfile}
                  >
                    {' '}
                    <UserIcon /> {t('profile')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 p-0 py-1 cursor-pointer"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    {' '}
                    <LogOut /> {t('logout')}
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <SwitchLanguage />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
