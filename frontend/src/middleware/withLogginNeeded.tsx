import { useAuthContext } from '@/contexts/AuthContext';
import { Error } from '@/pages/error';
import { useNavigate } from 'react-router-dom';

export const WithLogginNeeded: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loggedIn } = useAuthContext();
  const navigate = useNavigate();
  const handleNavigateToSignin = () => {
    navigate('/signin');
  };

  if (!loggedIn)
    return (
      <Error
        errorMessage="you must be logged in to access this page"
        errorCode={401}
        handleAction={handleNavigateToSignin}
        buttonTitle="Singin"
      />
    );

  return children;
};
