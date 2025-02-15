import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export function Step2({ register, errors }: { register: any; errors: any }) {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="username" className="text-left">
          {t('username')}:
        </Label>
        <Input
          id="username"
          type="text"
          className="text-left"
          placeholder="Eduardofp17"
          {...register('username', {
            required: t('username-required'),
            minLength: {
              value: 3,
              message: t('username-length'),
            },
            maxLength: {
              value: 20,
              message: t('username-length'),
            },
            pattern: {
              value: /^[a-zA-Z0-9]+$/,
              message: t('username-invalid'),
            },
          })}
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username.message}</p>
        )}
      </div>
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
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>
    </>
  );
}
