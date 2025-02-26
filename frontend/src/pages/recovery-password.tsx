import { useGlobalContext } from '@/contexts/GlobalContext';
import { useForm } from 'react-hook-form';
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
  CardTitle,
} from '@/components/ui/card';
import { InputPassword } from '@/components/ui/input-password';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { JwtUtils } from '@/utils/jwt/jwt';
import { useAuthContext } from '@/contexts/AuthContext';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import { SuccessCode } from '@/response-codes';

export const RecoveryPassword: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  document.title = 'Eduardofp Blog - Recovery Password';
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ password: string; confirmPassword: string }>();
  const { loading, setLoading } = useGlobalContext();
  const { loggedIn, logout } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token: string = searchParams.get('token') || '';
  const jwtUtils = new JwtUtils(token);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(
    jwtUtils.isValidToken()
  );
  const { request } = useApiRequest();

  const password = watch('password', '');
  useEffect(() => {
    setIsTokenValid(jwtUtils.isValidToken());
  }, []);

  const handleRedefinePassword = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);

    try {
      const sub = jwtUtils.getSubFromToken();
      const response = await request(
        `/users/me/redefine-password/${sub}`,
        Methods.PATCH,
        { 'Content-Type': 'application/json' },
        { password: data.password },
        SuccessCode.PASSWORD_SUCCESSFULLY_REDEFINED
      );

      if (!response.success) return;
      if (loggedIn) logout();
      navigate('/signin');
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    children
  ) : (
    <>
      {!isTokenValid ? (
        <section className="pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto text-xl font-bold items-center text-center animate-scroll flex flex-col gap-4">
          <h2 className="text-2xl">{t('invalid token')}</h2>
          <p className="font-normal text-base">
            {t('if you still need to redefine your password')}{' '}
            <Link to="/forgot-password" className="underline text-sm">
              {' '}
              {t('redefine your password')}
            </Link>{' '}
          </p>
        </section>
      ) : (
        <section className="pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto text-xl font-bold items-center text-center animate-scroll flex flex-col gap-10">
          <Card>
            <CardHeader className="text-left">
              {' '}
              <CardTitle>{t('redefine your password')}</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <form
                action="post"
                id="recovery-password-form"
                onSubmit={handleSubmit(handleRedefinePassword)}
              >
                <InputPassword
                  register={register}
                  errors={errors}
                  name="password"
                />
                <InputPassword
                  register={register}
                  errors={errors}
                  name="confirmPassword"
                  validate={(value) =>
                    value === password || t('password-must-match')
                  }
                />
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button form="recovery-password-form">
                {t('redefine your password')}
              </Button>
            </CardFooter>
          </Card>
        </section>
      )}
    </>
  );
};
