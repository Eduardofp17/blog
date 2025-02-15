import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { ViewProps } from './types';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Label } from '../label';
import { Send, MailCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import { SuccessCode } from '@/response-codes';
import { useToast } from '@/hooks/use-toast';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useAuthContext } from '@/contexts/AuthContext';
import { useGlobalContext } from '@/contexts/GlobalContext';

type TimeLeft = {
  minutes: string;
  seconds: string;
};

export const VerifyEmailDialogView: React.FC<ViewProps> = ({
  email,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const { t, i18n } = useTranslation();
  const {
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<{ code: string }>();
  const [sentEmail, setSentEmail] = useState<boolean>(false);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tries, setTries] = useState<number>(5);
  const [exceedTries, setExceedTries] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    minutes: '05',
    seconds: '00',
  });
  const { handleSaveUserInCookie } = useAuthContext();
  const { user } = useGlobalContext();
  const { request } = useApiRequest();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDialogOpenChange = () => {
    if (!emailVerified) return;
    setIsDialogOpen(false);
  };

  const langs = {
    pt: 'pt-br',
    en: 'en-us',
  };

  const handleSendVerificationCode = async () => {
    try {
      setLoading(true);
      const response = await request(
        `/auth/signup/send-verification-code/${email}/?lang=${langs[i18n.language as 'pt' | 'en'] || 'pt'}`,
        Methods.POST,
        { 'Content-Type': 'application/json' },
        {},
        SuccessCode.VERIFICATION_CODE_SUCCESSFULLY_SENT
      );

      if (!response.success) return;

      setSentEmail(true);
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTries = () => {
    if (tries < 1) {
      setTries(0);
      return;
    }

    setTries((prev) => prev - 1);
  };

  const handleVerifyEmail = async (data: { code: string }) => {
    try {
      setLoading(true);
      handleChangeTries();
      const response = await request(
        `/auth/signup/verify-email/${email}/?lang=${langs[i18n.language as 'pt' | 'en'] || 'pt'}`,
        Methods.POST,
        { 'Content-Type': 'application/json' },
        data,
        SuccessCode.EMAIL_SUCCESSFULLY_VERIFIED
      );

      if (!response.success) return;

      setSentEmail(true);
      setIsDialogOpen(false);
      setEmailVerified(true);
      handleSaveUserInCookie({ ...user, email_verified: true });
    } catch (err) {
      throw new Error('Internal Server Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tries <= 0) {
      setExceedTries(true);
    }
  }, [tries]);

  useEffect(() => {
    if (emailVerified) navigate('/signin');
  }, [emailVerified]);

  useEffect(() => {
    if (timeLeft.minutes === '00' && timeLeft.seconds === '00') {
      setSentEmail(false);
      setExpiresAt(null);
      setTimeLeft({ minutes: '05', seconds: '00' });
      setTries(5);
      setExceedTries(false);
      setValue('code', '000000');
    }
  }, [timeLeft]);

  useEffect(() => {
    if (sentEmail) {
      const date = new Date();
      setExpiresAt(new Date(date.getTime() + 5 * 60 * 1000));
    }
  }, [sentEmail]);

  useEffect(() => {
    if (!expiresAt) return;

    const timer = setInterval(() => {
      const now = new Date();
      const remaining = expiresAt.getTime() - now.getTime();

      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft({ minutes: '00', seconds: '00' });
      } else {
        const minutes = Math.floor(remaining / (1000 * 60))
          .toString()
          .padStart(2, '0');
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, '0');

        setTimeLeft({ minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  useEffect(() => {
    if (!expiresAt) return;
    const now = new Date();
    if (
      expiresAt.getTime() >= now.getTime() &&
      sentEmail &&
      !emailVerified &&
      exceedTries
    ) {
      setErrorMessage('you have exceed the tries');
      setError(true);
    }
  }, [expiresAt, sentEmail, emailVerified, exceedTries]);

  useEffect(() => {
    if (error && errorMessage !== '') {
      toast({
        title: t('error'),
        description: t(errorMessage),
        variant: 'destructive',
      });

      setError(false);
      setErrorMessage('');
    }
  }, [error, errorMessage]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      {loading ? (
        <DialogContent className="h-56 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl p-6 flex flex-col gap-6 text-center items-center justify-center">
          <DialogTitle hidden>Loading</DialogTitle>
          <DialogDescription hidden>
            we're sending the verification code for you email
          </DialogDescription>
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-black dark:border-white"></div>
        </DialogContent>
      ) : (
        <DialogContent
          className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl p-6 flex flex-col gap-6 text-center"
          aria-describedby="verify-your-email-description"
        >
          <DialogHeader>
            <DialogTitle className="text-center">
              {t('verify your email')}
            </DialogTitle>
            <DialogDescription
              className={`text-center ${sentEmail ? 'hidden' : ''}`}
            >
              {t('verify your email by clicking in the button')}
            </DialogDescription>
            <DialogDescription
              id="verify-your-email-description"
              className={`${sentEmail ? '' : 'hidden'} text-center`}
            >
              {t('time left')} <br />
              <br />
              <span className="text-white text-xl">
                {timeLeft.minutes}:{timeLeft.seconds}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div>
            <form
              action="post"
              onSubmit={handleSubmit(handleVerifyEmail)}
              className="flex flex-col gap-4 items-center justify-center"
            >
              <div className="text-center">
                <Label
                  htmlFor="verification-code"
                  className="text-center m-auto"
                >
                  {t('verification code')}
                </Label>
                <InputOTP
                  maxLength={6}
                  value={watch('code') || ''}
                  onChange={(value) => setValue('code', value)}
                  onComplete={(value) => handleVerifyEmail({ code: value })}
                  className="mx-auto"
                  disabled={sentEmail ? false : true}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {errors.code && (
                  <p className="text-red-500 text-sm">{errors.code.message}</p>
                )}
              </div>
              <p className={`text-center text-xs ${sentEmail ? '' : 'hidden'}`}>
                <span className="text-red-500">*</span> {t('you have only')}{' '}
                <span className="font-bold">{tries}</span> {t('tries')}
              </p>
              <Button
                className={`${sentEmail ? 'flex' : 'hidden'} justify-between w-36 m-auto`}
                disabled={exceedTries ? true : false}
              >
                {t('verify email')} <MailCheck />
              </Button>
            </form>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              className={`${sentEmail ? 'hidden' : 'flex'} justify-between w-52 m-auto`}
              onClick={handleSendVerificationCode}
            >
              {t('send verification code')} <Send />
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
