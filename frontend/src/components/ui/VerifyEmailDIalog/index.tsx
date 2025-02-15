import { createElement } from 'react';
import { IProps, ViewProps } from './types';
import { VerifyEmailDialogView } from './view';

export const VerifyEmailDialog: React.FC<IProps> = ({
  isDialogOpen,
  email,
  setIsDialogOpen,
}) => {
  const ViewProps: ViewProps = {
    email,
    isDialogOpen,
    setIsDialogOpen,
  };

  return createElement(VerifyEmailDialogView, ViewProps);
};
