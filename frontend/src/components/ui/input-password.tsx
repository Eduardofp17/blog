import { Label } from './label';
import { Input } from './input';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegister, Path, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type InputPasswordProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  name: Path<T>;
  errors?: Record<string, any>;
  validate?: (value: string) => string | boolean;
};

export function InputPassword<T extends FieldValues>({
  register,
  name,
  errors,
  validate,
}: InputPasswordProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const { t } = useTranslation();

  return (
    <div>
      <Label htmlFor={name} className="text-left">
        {t(name)}:
      </Label>
      <div className="relative w-full">
        <Input
          id={name}
          className="border w-full pr-10"
          type={showPassword ? 'text' : 'password'}
          {...register(name, {
            required: t(`${name}-required`),
            minLength: {
              value: 6,
              message: t('password-min-length'),
            },
            maxLength: {
              value: 50,
              message: t('password-max-length'),
            },
            validate,
          })}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}
