import { createElement } from 'react';
import { IProps, ModalViewProps } from './types';
import { ModalView } from './modal-view';

export const Modal: React.FC<IProps> = ({
  ModalDescription,
  ModalTitle,
  handleAction,
  isModalOpen,
  confirmButtonTitle,
  setIsModalOpen,
  btnCancelText,
  buttonColor,
}) => {
  const ViewProps: ModalViewProps = {
    ModalDescription,
    ModalTitle,
    confirmButtonTitle,
    handleAction,
    isModalOpen,
    setIsModalOpen,
    btnCancelText,
    buttonColor,
  };

  return createElement(ModalView, ViewProps);
};
