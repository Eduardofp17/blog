import { useAuthContext } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { VerifyEmailDialog } from '@/components/ui/VerifyEmailDIalog';
import { UserCookie } from '@/types';

export const WithEmailVerification: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { loggedIn } = useAuthContext();
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const userCookie = Cookies.get('user');
  const user: UserCookie | undefined = userCookie
    ? JSON.parse(userCookie)
    : undefined;

  useEffect(() => {
    if (user?.email_verified === false) {
      setShowDialog(true);
    }
  }, [user]);
  if (!user && !loggedIn) return <> {children} </>;

  return (
    <>
      <VerifyEmailDialog
        isDialogOpen={showDialog}
        setIsDialogOpen={setShowDialog}
        email={user ? user.email : ''}
      />
      {children}
    </>
  );
};
