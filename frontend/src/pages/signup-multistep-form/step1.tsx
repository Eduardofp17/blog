import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';

export function Step1({ register, errors }: { register: any; errors: any }) {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Label htmlFor="name" className="text-left">
          {t('name')}:
        </Label>
        <Input
          id="name"
          type="text"
          className="text-left"
          placeholder="Eduardo"
          {...register('name', {
            required: t('name-required'),
            minLength: {
              value: 2,
              message: t('name-length'),
            },
            maxLength: {
              value: 50,
              message: t('name-length'),
            },
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="lastname" className="text-left">
          {t('lastname')}:
        </Label>
        <Input
          id="lastname"
          type="text"
          className="text-left"
          placeholder="Pinheiro"
          {...register('lastname', {
            required: t('lastname-required'),
            minLength: {
              value: 2,
              message: t('lastname-length'),
            },
            maxLength: {
              value: 50,
              message: t('lastname-length'),
            },
          })}
        />
        {errors.lastname && (
          <p className="text-red-500 text-sm">{errors.lastname.message}</p>
        )}
      </div>
    </>
  );
}
