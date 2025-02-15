type ModalViewProps = {
  ModalTitle: string;
  ModalDescription: string;
  isModalOpen: boolean;
  confirmButtonTitle: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAction: () => void;
  buttonColor: ButtonColor;
  btnCancelText: string;
};

type IProps = {} & ModalViewProps;

type ButtonColor = 'red' | 'yellow' | 'green';

interface ButtonStyle {
  bg: string;
  hover: string;
}

export const ButtonColors: Record<ButtonColor, ButtonStyle> = {
  red: { bg: 'bg-red-500', hover: 'hover:bg-red-600' },
  yellow: { bg: 'bg-yellow-500', hover: 'hover:bg-yellow-600' },
  green: { bg: 'bg-green-500', hover: 'hover:bg-green-600' },
};

export type { ModalViewProps, IProps, ButtonColor, ButtonStyle };
