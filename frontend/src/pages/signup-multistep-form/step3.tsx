import { InputPassword } from '@/components/ui/input-password';
import { useTranslation } from 'react-i18next';

export function Step3({
  register,
  errors,
  watch,
}: {
  register: any;
  errors: any;
  watch: any;
}) {
  const { t } = useTranslation();
  const password = watch('password');
  return (
    <>
      <InputPassword register={register} errors={errors} name="password" />
      <InputPassword
        register={register}
        errors={errors}
        name="confirmPassword"
        validate={(value) => value === password || t('password-must-match')}
      />
    </>
  );
}
