import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import { SuccessCode } from '@/response-codes';

export const ForgotPassword: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t, i18n } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<{ email: string }>();
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const language = {
    pt: 'pt-br',
    en: 'en-us',
  };
  const { setLoading } = useGlobalContext();
  const { request } = useApiRequest();
  const email = watch('email', '');

  const handleSendEmailLink = async (data: { email: string }) => {
    setLoading(true);
    setLocalLoading(true);
    try {
      const response = await request(
        `/users/forgot-password/?lang=${language[i18n.language as 'pt' | 'en'] || 'pt'}`,
        Methods.POST,
        { 'Content-Type': 'application/json' },
        data,
        SuccessCode.RECOVERY_PASSWORD_LINK_SENT
      );

      if (!response.success) return;

      setValue('email', '');
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
      setLocalLoading(false);
    }
  };

  return localLoading ? (
    children
  ) : (
    <>
      <section className="pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto text-xl font-bold items-center text-center animate-scroll flex flex-col gap-10">
        <div id="texts" className="flex flex-col gap-2">
          <h1>{t('forgot your password?')}</h1>
          <p className="font-normal text-base">
            {t('type your email to recovery your password')}
          </p>
        </div>

        <Card>
          <CardHeader className="text-left">
            <CardTitle>{t('recovery password')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="forgot-password-form"
              onSubmit={handleSubmit(handleSendEmailLink)}
            >
              <div className="text-left">
                <Label htmlFor="email" className="text-left">
                  Email:{' '}
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-left"
                  placeholder="example@email.com"
                  value={email}
                  {...register('email', {
                    required: t('email-required'),
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: t('invalid-email'),
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="items-center flex justify-center mt-3">
            <Button
              form="forgot-password-form"
              type="submit"
              className="w-auto"
            >
              {t('send link to email')}
            </Button>
          </CardFooter>
        </Card>
      </section>{' '}
    </>
  );
};
