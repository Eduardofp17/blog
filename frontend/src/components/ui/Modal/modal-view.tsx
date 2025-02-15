import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import React from 'react';
import { ModalViewProps } from './types';
import { ButtonColors } from './types';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';

export const ModalView: React.FC<ModalViewProps> = ({
  ModalTitle,
  ModalDescription,
  isModalOpen,
  confirmButtonTitle,
  setIsModalOpen,
  handleAction,
  buttonColor,
  btnCancelText,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent
        className="mx-auto my-auto p-6 sm:max-w-lg w-full max-w-[90%]"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{ModalTitle}</DialogTitle>
          <DialogDescription id="dialog-description">
            {ModalDescription}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => setIsModalOpen(false)}
            variant="outline"
            className="font-bold"
          >
            {btnCancelText}
          </Button>
          <Button
            onClick={handleAction}
            className={`${ButtonColors[buttonColor].bg} text-white font-bold ${ButtonColors[buttonColor].hover}`}
          >
            {t(confirmButtonTitle)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
