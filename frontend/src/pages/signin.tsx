import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { InputPassword } from '@/components/ui/input-password';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import type { ApiSuccessResponse, SigninResponse } from '@/types';

type FormData = {
  email: string;
  password: string;
};

export function SignIn() {
  document.title = 'Eduardofp Blog - Signin';
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { setLoading } = useGlobalContext();
  const { loggin, loggedIn, handleSaveUserInCookie } = useAuthContext();
  const { request } = useApiRequest();

  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate('/');
  };

  useEffect(() => {
    if (loggedIn) handleNavigateHome();
  }, []);

  const onSubmit = async (formData: FormData) => {
    try {
      const response = await request<SigninResponse>(
        `/auth/signin`,
        Methods.POST,
        { 'Content-Type': 'application/json' },
        formData
      );

      if (!response.success) return;

      const { data } = response as ApiSuccessResponse<SigninResponse>;
      const { user, access_token } = data;
      const token = access_token;

      // const userCookie: UserCookie = {
      //   _id: user._id,
      //   username: user.username,
      //   email: user.email,
      //   name: user.name,
      //   lastname: user.lastname,
      //   email_verified: user.email_verified,
      // };

      handleSaveUserInCookie(user);
      loggin(token);
      handleNavigateHome();
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="flex-grow">
        <section
          id="signin"
          className="h-max pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto text-xl font-bold items-center text-center"
        >
          <Card className="shadow-md max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-left">{t('signin')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                action="post"
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col text-left gap-4"
              >
                <div>
                  <Label htmlFor="email" className="text-left">
                    Email:{' '}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="text-left"
                    placeholder="example@email.com"
                    {...register('email', {
                      required: t('email-required'),
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: t('invalid-email'),
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <InputPassword
                    register={register}
                    errors={errors}
                    name="password"
                  />
                  <span className="text-xs font-normal">
                    {t('forgot your password?')}{' '}
                    <Link to="/forgot-password" className="underline">
                      {t('redefine your password here')}
                    </Link>
                  </span>
                </div>
                <Button>{t('submit')}</Button>
              </form>
            </CardContent>
            <CardFooter className="w-full text-center flex justify-center pt-4">
              <span className="text-xs text-center flex flex-row gap-1">
                {t('not a user')}
                <a href="/signup" className="underline">
                  {t('signup-now')}
                </a>
              </span>
            </CardFooter>
          </Card>
        </section>
      </main>
    </>
  );
}
