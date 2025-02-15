import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Step1 } from './step1';
import { Step2 } from './step2';
import { Step3 } from './step3';
import { Stepper } from '@/components/ui/stepper';
import { VerifyEmailDialog } from '@/components/ui/VerifyEmailDIalog';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import Cookies from 'js-cookie';
import { UserCookie } from '@/types';
import { ApiSuccessResponse } from '@/types';

type FormData = {
  name: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function MultiStepForm() {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const userEmail = watch('email', '');
  const { request } = useApiRequest();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await request(
        `/auth/signup`,
        Methods.POST,
        { 'Content-Type': 'application/json' },
        {
          username: data.username,
          email: data.email,
          name: data.name,
          lastname: data.lastname,
          password: data.password,
        }
      );

      if (!response.success) return;
      const responseData = (response as ApiSuccessResponse<UserCookie>).data;

      const user: UserCookie = {
        _id: responseData._id,
        username: responseData.username,
        email: responseData.email,
        name: responseData.name,
        lastname: responseData.lastname,
        email_verified: responseData.email_verified,
      };

      Cookies.set('user', JSON.stringify(user), {
        expires: 15,
      });

      setShowDialog(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  const previous = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
    }
  };

  const next = () => {
    if (step < 2) {
      setStep((prevStep) => prevStep + 1);
    }
  };
  return (
    <>
      <VerifyEmailDialog
        isDialogOpen={showDialog}
        setIsDialogOpen={setShowDialog}
        email={userEmail}
      />
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center pb-36">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black dark:border-white"></div>
        </div>
      ) : (
        <Card className="shadow-md max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-left">{t('signup')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Stepper currentStep={step} />

            <form action="post" className="flex flex-col text-left gap-4 mt-9">
              {step === 0 && <Step1 register={register} errors={errors} />}
              {step === 1 && <Step2 register={register} errors={errors} />}
              {step === 2 && (
                <Step3 register={register} errors={errors} watch={watch} />
              )}
              <div className="w-full flex flex-row justify-between gap-12">
                {step > 0 && (
                  <Button
                    className="w-full"
                    type="button"
                    onClick={previous}
                    variant="outline"
                  >
                    {t('previous')}
                  </Button>
                )}
                {step < 2 ? (
                  <Button className="w-full" type="button" onClick={next}>
                    {t('next')}
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    type="button"
                    onClick={handleSubmit(onSubmit)}
                  >
                    {t('submit')}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="w-full text-center flex justify-center pt-4">
            <span className="text-xs text-center flex flex-row gap-1">
              {t('must signin')}
              <a href="/signin" className="underline">
                {t('signin now')}
              </a>
            </span>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
