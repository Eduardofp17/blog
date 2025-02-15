import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
export function Stepper({ currentStep }: { currentStep: number }) {
  const steps = ['personal-info', 'account-data', 'security'];
  const { t } = useTranslation();

  return (
    <div className="flex flex-row w-full gap-4 justify-center border-b-2 pb-2">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex flex-col items-center text-center text-xs justify-start gap-2 ${
            currentStep === index ? 'text-blue-500' : 'text-gray-500'
          } w-[30%]`}
        >
          <div
            className={`flex items-center justify-center border w-12 h-12 rounded-full text-lg font-bold ${
              currentStep === index ? 'border-blue-500' : 'border-gray-300'
            } ${index < currentStep ? 'dark:bg-green-500 border-none bg-green-700' : ''}`}
          >
            {index < currentStep ? (
              <Check className="text-white font-bold dark:text-black" />
            ) : (
              index + 1
            )}
          </div>

          <span className="min-h-[2rem] flex items-center justify-center">
            {t(step)}
          </span>
        </div>
      ))}
    </div>
  );
}
