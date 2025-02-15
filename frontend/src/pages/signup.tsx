import { MultiStepForm } from './signup-multistep-form/multistep-form';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function Signup() {
  document.title = 'Eduardofp Blog - Signup';
  const { loading } = useGlobalContext();
  const { loggedIn } = useAuthContext();
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate('/');
  };
  useEffect(() => {
    if (loggedIn) handleNavigateHome();
  }, []);

  return (
    <>
      <div className="flex flex-col  animate-scroll">
        {loading ? (
          <main className="flex-grow flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black dark:border-white"></div>
          </main>
        ) : (
          <main className="flex-grow">
            <section
              id="signin"
              className="h-max pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto text-xl font-bold items-center text-center"
            >
              <MultiStepForm />
            </section>
          </main>
        )}
      </div>
    </>
  );
}
